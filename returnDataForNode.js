// description: Return all data for a given UNIQUE node name
// returnDataForNode.js
//
// Inputs are: the UNIQUE node name across all assigned CDS
//    Input type: an object arg containing a string
// Outputs are: UNIQUE the data for the specific node name
//    Output type: config datasets
//
// Creator: Dimtris
// Maintainer: Cyrille
// Version:   1.1
// Support: Sweagle version >= 3.11

// VARIABLES DEFINITION
// Copy the config datasets
var subset = cds;
// Store all the config datasets
var superCDS={};
// Root node string used to concatenate all CDS in superCDS
var rootNode="";
// Number of occurences of the node name found witin the config datasets
var nodesWithSameName = 0;
// Defines the node name: placeholder of the provided argument node name
var nodeName = "";
// Errors variables
var errorFound = false;
var errors = [];
var errors_description = '';

// HANDLERS
// Inputs parser and checker
  // Input values in object notation
  // Checking the assigned config datasets and parse the node name from input values in object notation
  if (arg!=null && cds!=null){
    for (var i=0; i<cds.length; i++){
      rootNode = Object.keys(cds[i])[0];
      superCDS[rootNode] = cds[i][rootNode];
    }
    nodeName=objFormat(arg);
  } else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
  }

// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
    // ["Value1"]
    var jsonRegex = new RegExp("\"(.*?)\"");
    // <nodeName>Value</nodeName>
    var xmlRegex = new RegExp("^\<.*\>(.*?)<\/.*\>$");
    // nodeName: Value
    var yamlRegex = new RegExp("^.*\:\ (.*?)$");
  	// JSON
    if (jsonRegex.test(obj)) {
      nodeName=jsonRegex.exec(obj)[1];
      return nodeName;
    }
    // XML
  	else if (xmlRegex.test(obj)) {
      nodeName=xmlRegex.exec(obj)[1];
      return nodeName;
    }
    // YAML
    else if (yamlRegex.test(obj)) {
      nodeName=yamlRegex.exec(obj)[1];
      return nodeName;
     }
	// Unexpected Inputs
  	else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, the arg object must contains an unique string");
    }
  }

// MAIN
// If the node name has been correctly parsed without any error detected so far!
if (nodeName!=null && !errorFound) {
  // Retrieve the UNIQUE data for the node name
  retrieveAllData(superCDS, nodeName);
  // Checks if the node name occurences witin the config dataset
  if (nodesWithSameName === 0) {
    errorFound=true;
    errors.push("ERROR: nodeName: "+nodeName+" not found");
    // If only one node name occurrance has been found returns the subset data
  } else if (nodesWithSameName === 1) {
    return subsets;
  } else {
    errorFound=true;
    errors.push("ERROR: multiple nodeNames: "+nodeName+" found");
  }
} else {
  errorFound=true;
    errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
}
// Return the list of all errors trapped
errors_description = errors.join(', ');
return {description: errors_description, result:!errorFound};

// FONCTIONS LIST
// Recursive function to retrieve the node name and its all related data.
function retrieveAllData(mds, nodevalue) {
  for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
      // If the current node equals the node name
      if (nodevalue === item) {
        nodesWithSameName = nodesWithSameName + 1;
        // Returns the config dataset for the current node name
        subsets = mds[item];
      } else {
        // Continue to search in the next node
        retrieveAllData(mds[item], nodevalue);
      }
    }
  }
}
