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
// Version:   1.2 - add retro compatibility
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
if (args[0]!=null) {
  // Input value in old notation (for retro compatibility)
  nodeName=args[0];
} else if (arg!=null && arg!="") {
  // Input values in object notation
  // Checking the assigned config datasets and parse the node name from input values in object notation
  nodeName=objFormat(arg.trim());
} else {
  // If no input is provided then return main cds (for retro compatibility)
  return cds[0];
  //errorFound=true;
  //errors.push("ERROR: No inputs provided! Please provide at least one cds and one arg in object notation.");
}
for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
  var matches, index;
  // {
  // 	"nodeNames" : ["Value1","Value2","Value3"]
  // }
  var jsonRegex = /\"(.*?)\"/gm;
// <nodeNames>
//		<nodeName>Value1</nodeName>
//		<nodeName>Value2</nodeName>
//		<nodeName>Value3</nodeName>
//	</nodeNames>
  var xmlRegex = /\<.*\>(.*?)<\/.*\>/gm;
// nodeName:
//	-Value1
//	-Value2
//	-Value3
  var yamlRegex = /.*\-(.*?)$/gm;
  // JSON
  if (jsonRegex.test(obj)) {
  matches = JSON.parse(obj);
      nodeNamesArray = matches.nodeNames;
  return nodeNamesArray;
  }
  // XML
  else if (xmlRegex.test(obj)) {
  matches = Array.from(obj.matchAll(xmlRegex));
      for (index in matches) {nodeNamesArray.push(matches[index][1]);}
  return nodeNamesArray;
  }
  // YAML
  else if (yamlRegex.test(obj)) {
      matches = Array.from(obj.matchAll(yamlRegex));
      for (index in matches) {nodeNamesArray.push(matches[index][1]);}
  return nodeNamesArray;
  }
  // no object format, return teh string as is
  else {
    return obj;
  }
}
//console.log("nodeName="+nodeName);
// MAIN
// If the node name has been correctly parsed without any error detected so far!
if (nodeName!=null && !errorFound) {
  // Retrieve the UNIQUE data for the node name
  retrieveAllData(superCDS, nodeName);
  // Checks if the node name occurences witin the config dataset
  if (nodesWithSameName === 0) {
    errorFound=true;
    errors.push("ERROR: nodeName: "+nodeName+" not found");
    // If only one node name occurrence has been found returns the subset data
  } else if (nodesWithSameName === 1) {
    return subset;
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

// FUNCTIONS LIST
// Recursive function to retrieve the node name and its all related data.
function retrieveAllData(dataset, nodevalue) {
  for (var item in dataset) {
    if (typeof(dataset[item]) === 'object') {
      // If the current node equals the node name
      if (nodevalue === item) {
        nodesWithSameName = nodesWithSameName + 1;
        // Returns the config dataset for the current node name
        subset = dataset[item];
      } else {
        // Recursive search in the node
        retrieveAllData(dataset[item], nodevalue);
      }
    }
  }
}
