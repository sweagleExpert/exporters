// description: Return a specific path in an OpenShift Template file format

// returnOpenshiftTemplate.js
// Exporter to return a specific path in an OpenShift Template file format
//
// This exporter is based on "returnDataforGivenPath.js"
// It adds formatting output to transform list in arrays as expected for template file
//
// Inputs are
//    - list of keys that represents the path to extract
//
// Creator:   Anastasia and Dimitris for customer POC
// Version:   1.2 - get the first node result
//
var subset = metadataset;
var repeatedNode = 0;

function retrieveAllData(obj, args) {

  for (var item in obj) {
    if (typeof(obj[item]) === 'object') {
      // search for arg item and stop when found first one
      if (args === item) {
        repeatedNode = repeatedNode + 1;
        subset = obj[item];
        break;
      }
      else {
        retrieveAllData(obj[item], args);
      }
    }
  }
}

function mapObjectsToArray( subKey ) {
    var returnedArray = [];
    for (var item in subset[subKey]) {
        returnedArray.push(subset[subKey][item]);
    }
    subset[subKey] = returnedArray;
}


if (args[0]!=null) {
  retrieveAllData(metadataset, args[0]);
  if (subset.hasOwnProperty('objects')) {
    mapObjectsToArray('objects');
  }
  if (subset.hasOwnProperty('parameters')) {
    mapObjectsToArray('parameters');
  }
}
else {
  return "ERROR: no keyName provided";
}

if (repeatedNode === 0) {
  return "ERROR: keyname not found";
} else {
  return subset;
}
