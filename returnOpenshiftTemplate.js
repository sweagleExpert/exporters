//
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
// Version:   1.1
//
var subset = metadataset;

// we loop through all provided arguments (= nodeNames in the path) and check if the path exist
// when we get to the last argument we return whole metadataset at that last nodeName.
for (var i = 0; i < args.length; i++) {

    // check if path is valid and if so store all data in subset
    if (subset.hasOwnProperty(args[i]) === true) {
        subset = subset[args[i]];
    }
    // if not valid return error message
    else {
        return "ERROR: path not found: " + args[i];
    }
}

// function to transform a node from Object to Array
function mapObjectsToArray( subKey ) {
    var returnedArray = [];
    for (var item in subset[subKey]) {
        returnedArray.push(subset[subKey][item]);
    }
    subset[subKey] = returnedArray;
}

// Now than subset has been calculated,
// transform some keys into arrays to be compliant with OpenShift template format
if (subset.hasOwnProperty('objects')) {
    mapObjectsToArray('objects');
}

if (subset.hasOwnProperty('parameters')) {
    mapObjectsToArray('parameters');
}

return subset;
