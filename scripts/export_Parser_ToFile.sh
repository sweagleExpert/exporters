#!/usr/bin/env bash
source $(dirname "$0")/sweagle.env

##########################################################################
#############
#############   EXPORT A PARSER FROM SWEAGLE TO A FILE
#############
############# Inputs: See error message below
############# Output: 0 if no errors, 1 + Details of errors if any
##########################################################################
if ! ([ -x "$(command -v python)" ] || [ -x "$(command -v jq)" ]) ; then
  echo "########## ERROR: PYTHON or JQ IS REQUIRED FOR THIS SCRIPT"
  exit 1
fi

if [ "$#" -lt "3" ]; then
    echo "########## ERROR: NOT ENOUGH ARGUMENTS SUPPLIED"
    echo "########## YOU SHOULD PROVIDE 1- PARSER NAME, 2- PARSER TYPE AND 3- FILENAME"
    echo "########## PARSER TYPE MUST BE EXPORTER, VALIDATOR OR TEMPLATE"
    exit 1
fi
argParserName=$1
argParserType=$2
argTargetFile=$3
parserId=""



# Put json parsers list in variable parsersList
function getParsers {
  echo "### Get parsers list"
  #For debug
  #echo "curl -sk -X GET '$sweagleURL/api/v1/tenant/metadata-parser' -H 'Authorization: bearer $aToken' -H 'Accept: application/vnd.siren+json'"
  if [ "$argParserType" = "TEMPLATE" ]; then
    response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/template-parser" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
  else
    response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/metadata-parser" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
  fi
  # Check if any error before continue
  errorFound=$(echo $response | jsonValue "error_description")
  if [[ -z $errorFound ]]; then
    parsersList="$response"
  else
    echo -e "\n###########"
    echo "### Error getting parser list: $errorFound"
    exit 1
  fi
}

#Return Parser Id from Parsers list identified by its name
function getParserIdFromName {
# Try first to get Id with JQ if present
if [ -x "$(command -v jq)" ] ; then
  parserName="$1"
  jsonValue="$2"
  id=$(echo ${jsonValue} | jq --arg parser_name ${parserName} '.entities[].properties | select(.name|index($parser_name)) | .id')
  echo ${id}
else
# Else, do it with PYTHON
parserName="$1" jsonValue="$2" python - <<EOF_PYTHON
#!/usr/bin/python
import json
import os
parserName = os.environ['parserName']
#print("### Use python to get Id for Parser "+parserName)
json1 = json.loads(os.environ['jsonValue'])
for item in json1["entities"]:
  if item["properties"]["name"] == parserName:
      print item["properties"]["id"]
EOF_PYTHON
fi
}

# Put json parsers list in variable parsersList
function getParser {
  echo "### Get parser"
  #For debug
  #echo "curl -sk -X GET '$sweagleURL/api/v1/tenant/metadata-parser' -H 'Authorization: bearer $aToken' -H 'Accept: application/vnd.siren+json'"
  if [ "$argParserType" = "TEMPLATE" ]; then
    response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/template-parser/$parserId" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
  else
    response=$(curl -sk -X GET "$sweagleURL/api/v1/tenant/metadata-parser/$parserId" -H "Authorization: bearer $aToken" -H "Accept: application/vnd.siren+json")
  fi
  # Check if any error before continue
  errorFound=$(echo $response | jsonValue "error_description")
  if [[ -z $errorFound ]]; then
    parser=$(echo ${response} | jq -r '.properties.script')
  else
    echo -e "\n###########"
    echo "### Error getting parser list: $errorFound"
    exit 1
  fi
}

# Write the snippet code to a file
function writeFile {
  echo "### Writing file"
  parser="$1"
  outputFile="$2"
  if [[ -f "$outputFile" ]]; then
    echo $parser | jq -r '.' >> $outputFile
  else
    touch $outputFile
    echo $parser | jq -r '.' > $outputFile
  fi
}

echo -e "\n###########"
getParsers
parserId=$(getParserIdFromName "$argParserName" "$parsersList")
getParser $parserId
writeFile "$parser" "$argTargetFile"