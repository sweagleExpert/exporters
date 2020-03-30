// description: Return all data for a given unique node name
// returnDataForNode.js
//
// Inputs are: the node name
//    Input type: an object (args, arg) containing a string
// Outputs are: the data for the specific node name
//    Output type: metadataset

//
// Creator: Dimtris
// Maintainer: Cyrille
// Version:   1.1
// Support: Sweagle 3.11

// VARIABLES DEFINITION
// Copy the metadatset
var subset = metadataset;
// Number of occurences of the node name
var nodesWithSameName = 0;
// Defines the node nade
var nodeName = "";

// HANDLERS
// Inputs parser and checker
if (args==null && arg==null) {
  return "ERROR: Inputs unexpected!, an object (args, arg) containing an unique string";
  // Input values in comma separated list
  } else if (args.length==1) {
    nodeName=args[0];
  }
  // Input values in object notation
  else if (arg!=null){
    nodeName=objFormat(arg);
  } else {
    return "ERROR: Inputs unexpected!, an object (args, arg) containing an unique string";
  }

  // Parse the object notation
function objFormat(obj) {
    // ["Value"]
    var jsonRegex='^\[\"(.*)\"\]$';
    // <nodeName>Value</nodeName>
    var xmlRegex='^\<.*\>(.*)<\/.*\>$';
    // nodeName: Value
    var yamlRegex='^.*\:\ (.*)$';
  	// JSON array
    if (obj.match(jsonRegex)!=null) {nodeName=obj.match(jsonRegex)[1];return nodeName;}
    // XML
  	else if (obj.match(xmlRegex)!=null) {nodeName=obj.match(xmlRegex)[1];return nodeName;}
    // YAML
    else if (obj.match(yamlRegex)!=null) {nodeName=obj.match(yamlRegex)[1];return nodeName;}
	// Unexpected Inputs
  	else {return "ERROR: Inputs unexpected!, an object (args, arg) containing an unique string";}
  }


// MAIN
if (nodeName!=null) {
  retrieveAllData(metadataset, nodeName);
} else {
  return metadataset;
}
// Checks if the node name occurences witin the dataset
if (nodesWithSameName === 0) {
  return "ERROR: nodeName not found";
} else if (nodesWithSameName === 1) {
  return subset;
} else {
  return "ERROR: multiple nodeNames found";
}

// FONCTIONS LIST
// Recursive function to retrieve the node name
function retrieveAllData(mds, args) {
  for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
      if (args === item) {
        nodesWithSameName = nodesWithSameName + 1;
        subset = mds[item];
      } else {
        retrieveAllData(mds[item], args);
      }
    }
  }
}
