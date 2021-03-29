# description: Return next index for specifc service and environment
# returnNextIndex.py
#
# Inputs: 2 CDS, CDS[0]=service and CDS[1]=environment instances
# search MDS for gpdn_hostname rule
# get the ##INDEX[1-9]?## Regex to calculate
# search the environment instance (=cds[1]) for next instance hostname to create


# IMPORT MODULES
# JSON module
#import json
# RegEx module
import re
# XML module
#import xml.etree.ElementTree as xml
# YAML module
#import yaml


hostnamesArray=list(cds[0]['Instances'].keys())
#print('hostnamesArray='+str(hostnamesArray))
indexRegex='##INDEX[1-9]?##'

# get value of a key based on its name
def getValueByName(mds, name):
  value = 'ERROR: NOT FOUND'
  # check if the key equals to the search term
  if name in mds:
    return mds[name]
  # check if the key points to an object
  for k, v in mds.items():
    if isinstance(v,dict):
    # if value is an object call recursively the function to search this subset of the object
      value = getValueByName(v, name)
      # if key was found, returns it
      if value != None:
        return value

# Replace any ##INDEX[pad]## found by the next index found for this value
def fillIndex(name):
  if re.search(indexRegex, name):
    position = name.index('##INDEX') + 7
    padSize = name[position:position + 1]
    if padSize == '#':
      name = name.replace('##INDEX##','')
      name = calculateIndex(name,0)  
    else:a
      name = name.replace('##INDEX'+padSize+'##','')
      name = calculateIndex(name,int(padSize))
  return name

def calculateIndex(body, padSize):
  #print('body='+body)
  #print('padSize='+str(padSize))
  fullPattern=''
  returnValue=''
  maxValue=''
  if padSize > 0:
    fullPattern = '^'+ body + '[0-9]'*padSize + '$'
  else:
    # If no padding, just search for number after prefix
    fullPattern = '^'+ body + '(\\d+)$'
  maxValue = findObjectKeys(hostnamesArray, body.lower(), fullPattern, maxValue)
  #print('maxValue='+maxValue)
  if maxValue != '':
    finalMaxValue = maxValue.split(body.lower())
    finalMaxValue[1] = int(finalMaxValue[1]) + 1
    if padSize > 0:
      returnValue = body + pad(finalMaxValue[1],padSize)
    else:
      returnValue = body + finalMaxValue[1]
      #print('returnValue='+returnValue)
    if re.match(fullPattern, returnValue):
      return returnValue
    else:
      return 'Out of bounds'
  else:
    return body + pad(1,padSize)

def pad(num, size):
  s = '000000000' + str(num)
  return s[len(s)-size:len(s)]


def findObjectKeys(hostArray, body, pattern, maxValue):
  #print('body='+body)
  #print('pattern='+str(pattern))
  length = len(hostArray)
  i=0
  while i<length:
    if re.search(pattern, hostArray[i]):
      if maxValue == '':
        maxValue = hostArray[i].lower()
      else:
        tempValue = hostArray[i].lower().split(body)
        tempValue2 = maxValue.split(body)
        if int(tempValue[1])>int(tempValue2[1]):
          maxValue = hostArray[i].lower()
    i += 1
  return maxValue
      
hostname = getValueByName(cds[0], 'nextIndexPattern')
#print('hostname='+hostname)
#print(fillIndex(hostname).lower())
return fillIndex(hostname).lower()