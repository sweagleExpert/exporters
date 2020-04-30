// description: Return all data for a given node path
// returnDataForPath.js
//
// Inputs are: the node path across all assigned CDS
//    Input type: an object arg containing a string,
//                each node of the path must be separated by comma
//                ex: {"nodepath":"rootnode,node1,node2"}
// 	  Outputs are: the data for the specific node path
//    Output type: configdatasets
//
// Creator: Dimtris
// Version:   1.1
// Support: Sweagle version >= 3.11

// VARIABLES DEFINITION
// Store all the config datasets
var superCDS={};
// Root node string used to concatenate all CDS in superCDS
var rootNode="";
// Defines the node name: placeholder of the provided argument node name
var nodePath = "";
// Defines the path separator character used to split nodePath into array
var pathSeparator = ",";
// Defines the node path array
var nodePathArray = [];
// Errors variables
var errorFound = false;
var errors = [];
var errors_description = '';

// HANDLERS
// Inputs parser and checker
// Checking the assigned configdata sets and parse the node name from input values in object notation
if (args[0]!=null) {
  // Input value in old notation (for retro compatibility)
  nodePathArray=args;
} else if (arg!=null && arg!="") {
  // Input values in object notation
  nodePath=objFormat(arg);
  // transform string into array based on pathSeparator
	nodePathArray=nodePath.split(pathSeparator);
} else {
  // If no input is provided then return main cds (for retro compatibility)
  return cds[0];
}
for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
  var valueToCheck;
  // <nodeName>Value</nodeName>
  var xmlRegex='^\<.*\>(.*)<\/.*\>$';
  // ---
  //nodeName: Value
  var yamlRegex='^---\n.*\:\ (.*)$';
  switch (obj.charAt(0)) {
	  // JSON
    case '{':
    case '[':
      var jsonObj=JSON.parse(obj);
      for (var key in jsonObj) { valueToCheck = jsonObj[key]; }
      return valueToCheck;
    // XML
    case '<':
      valueToCheck=obj.match(xmlRegex)[1];
      return valueToCheck;
    // YAML
    case '-':
      valueToCheck=obj.match(yamlRegex)[1];
      return valueToCheck;
    default:
      errorFound=true;
      errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
  }
}
//console.log(subset);
//console.log("nodePath="+nodePath);

// MAIN
// If the node path has been correctly parsed without any error detected so far!
if (nodePathArray!=null && !errorFound) {
	// we loop through all provided arguments (= nodePaths in the path) and check if the path exist
	// when we get to the last argument we return whole metadataset at that last nodePath.
	for (var i = 0; i < nodePathArray.length; i++) {
	  // check if path is valid and if so store all data in subset
		if (superCDS.hasOwnProperty(nodePathArray[i]) === true) {
			superCDS = superCDS[nodePathArray[i]];
		} else {
			// if not valid return error message
			errorFound=true;
	    errors.push("ERROR: path not found: "+nodePathArray[i]);
			break;
		}
	}
}

if (errorFound) {
	// Return the list of all errors trapped
	errors_description = errors.join(', ');
	return {description: errors_description, result:!errorFound};
} else {
	return superCDS;
}
