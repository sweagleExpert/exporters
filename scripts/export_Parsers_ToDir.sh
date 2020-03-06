#!/usr/bin/env bash
source $(dirname "$0")/sweagle.env

##########################################################################
#############
#############   EXPORT PARSERS FROM SWEAGLE TO A DIRECTORY
#############
############# Inputs: See error message below
############# Output: 0 if no errors, 1 + Details of errors if any
##########################################################################
if ! ([ -x "$(command -v python)" ] || [ -x "$(command -v jq)" ]) ; then
  echo "########## ERROR: PYTHON or JQ IS REQUIRED FOR THIS SCRIPT"
  exit 1
fi

if [ "$#" -lt "2" ]; then
    echo "########## ERROR: NOT ENOUGH ARGUMENTS SUPPLIED"
    echo "########## YOU SHOULD PROVIDE 1- PARSER TYPE, 2- DIRECTORY"
    echo "########## PARSER TYPE MUST BE EXPORTER, VALIDATOR OR TEMPLATE"
    exit 1
fi
argParserType=$1
argTargetDir=$2
parserName=""
parserSnippet=""


# Put json parsers list in variable parsersList filtered by parserType
function getParsers {
  echo "### Get parsers list"
  #For debug
  #echo "curl -sk -X GET '$sweagleURL/api/v1/tenant/metadata-parser' -H 'Authorization: bearer $aToken' -H 'Accept: application/vnd.siren+json'"
  if [ "$argParserType" = "TEMPLATE" ]; then
    response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/template-parser" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
  else
    if [ "$argParserType" = "EXPORTER" ]; then
      response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/metadata-parser?parserType=EXPORTER" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
    else
      response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/metadata-parser?parserType=VALIDATOR" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
    fi
  fi
  # Check if any error before continue
  errorFound=$(echo $response | jsonValue "error_description")
  if [[ -z $errorFound ]]; then
    parsersList=$(echo ${response} | jq -r '.entities')
  else
    echo -e "\n###########"
    echo "### Error getting parser list: $errorFound"
    exit 1
  fi
}

#Return Parser from Parsers list
function getParser {
# Try first to get Id with JQ if present
echo "### Get parser element"
if [ -x "$(command -v jq)" ] ; then
  jsonValue="$1"
  parserName=$(echo ${jsonValue} | jq -r '.properties.name')
  parserSnippet=$(echo ${jsonValue} | jq -c '.properties.script')
else
# Else, do it with PYTHON
jsonValue="$1" python - <<EOF_PYTHON
#!/usr/bin/python
import json
import os
#print("### Use python to get Name and Snippet for Parser ")
json1 = json.loads(os.environ['jsonValue'])
for item in json1["entities"]:
    print item["properties"]["name"]
    print item["properties"]["script"]
EOF_PYTHON
fi
}

# Write the snippet code to a file
function writeFile {
  echo "### Writing file"
  parserCode="$1"
  outputFile="$2"
  fileExtension="$3"
  filename="$outputFile"."$fileExtension"
  if [[ -d "$argTargetDir" ]]; then
    echo $parserCode | jq -r '.' >> $argTargetDir/$filename
  else
    touch $argTargetDir/$filename
    echo $parserCode | jq -r '.' > $argTargetDir/$filename
  fi
  echo "### file created: "+$argTargetDir/$filename 
}

echo -e "\n###########"
getParsers
arrayParsersLength=$(echo ${parsersList} | jq -r '. | length')
for ((i=0; i<$arrayParsersLength; i++)); do
  #In the JSON string, returns each array item with jq command
  parser=$(echo ${parsersList} | jq -r --arg array_item ${i} '.[$array_item|tonumber]')
  getParser "$parser"
  writeFile "$parserSnippet" "$parserName" "js"
done