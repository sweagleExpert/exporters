# description: Return all data for a given UNIQUE node name
# returnDataForNode.py
#
# Inputs are: the UNIQUE node name across all assigned CDS
#    Input type: an object arg containing a string
# Outputs are: UNIQUE the data for the specific node name
#    Output type: config datasets
#
# Creator: Cyrille
# Maintainer:
# Version:   0.9
# Support: Sweagle version >= 3.11

# IMPORT MODULES
# JSON module
import json
# RegEx module
#import re
# XML module
#import xml.etree.ElementTree as xml
# YAML module
#import yaml

# Parse the object notation: check upon against the RegEx format
def objFormat(obj):
  valueToCheck = ""
  # {"nodeName" : "Value"}
  # JSON format
  # <nodeName>Value</nodeName>
  # XML format
  # ---
  # nodeName: Value
  # YAML format
  if obj[0]=='{':
    # JSON
    jsonObj=json.loads(obj)
    valueToCheck=jsonObj["nodeName"]
    return valueToCheck
  # XML
  elif obj[0]=='<':
    #xmlObj=xml.fromstring(obj)
    #valueToCheck=xmlObj[0].text
    return valueToCheck
  # YAML
  elif obj[0]=='-':
    #yamlObj=yaml.load(obj)
    #valueToCheck=yamlObj["nodeName"]
    return valueToCheck
  else:
    global errorFound, errors
    errorFound = True
    errors.append("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.")


# FUNCTIONS LIST
# Recursive function to retrieve the node name and its all related data.
def retrieveAllData(dataset, nodevalue):
  # If the current node equals the node name
  # Returns the config dataset for the current node name
  if nodevalue in dataset:
	global nodesWithSameName
    nodesWithSameName += 1
    return dataset[nodevalue]
  # Recursive search in the node
  for k, v in dataset.items():
      if isinstance(v,dict):
          item = retrieveAllData(v, nodevalue)
          if item is not None:
            return item

# HANDLERS
# Inputs parser and checker
def handlers(arg):
  if arg!=None and arg!="":
    # Input values in object notation
    # Checking the assigned config datasets and parse the node name from input values in object notation
    return objFormat(arg.strip())
  else:
    global errorFound, errors
    errorFound = True
    errors.append("ERROR: No inputs provided! Please provide at least one cds and one arg in object notation.")
    # If no input is provided then return main cds (for retro compatibility)
    return cds[0]

# VARIABLES DEFINITION
# Copy the config datasets
subset = cds
# Store all the config datasets
superCDS = {}
# Number of occurences of the node name found witin the config datasets
nodesWithSameName = 0
# Defines the node name: placeholder of the provided argument node name
nodeName = ""
# Errors variables
errorFound = False
errors = list()
errors_description = ""

# MAIN
# If the node name has been correctly parsed without any error detected so far!
# CHECK IF ARG IS WELL DEFINED AND RETRIVE ITS CONTENT
nodeName=handlers(arg)
# MAIN ROUTINE
if nodeName is not None and errorFound is not True:
  for i in range(0, len(cds)):
    superCDS = cds[i]
    # Retrieve the UNIQUE data for the node name
  subset=retrieveAllData(superCDS, nodeName)
  # Checks if the node name occurences witin the config dataset
  global nodesWithSameName
  if nodesWithSameName == 0:
    global errorFound, errors, errors_description
    errorFound=True
    errors.append("ERROR: nodeName: "+ nodeName +" not found")
    # Return the list of all errors trapped
    errors_description = ', '.join(errors)
    return {"description":errors_description, "result":errorFound}
    # If only one node name occurrence has been found returns the subset data
  elif nodesWithSameName == 1:
    return subset
  else:
    global errorFound, errors, errors_description
    errorFound=True
    errors.append("ERROR: multiple nodeNames: "+ nodeName +" found")
    # Return the list of all errors trapped
    errors_description = ', '.join(errors)
    return {"description":errors_description, "result":errorFound}
else:
  global errorFound, errors, errors_description
  errorFound=True
  errors.append("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.")
  # Return the list of all errors trapped
  errors_description = ', '.join(errors)
  return {"description":errors_description, "result":errorFound}