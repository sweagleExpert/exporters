// description: Return all data for a given node path
// returnDataForPath.js
//
// Inputs are: the node path across assigned CDS
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
// Copy the config datasets
var subset = metadatasets[0];
// Store all the config datasets
var superCDS;
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
  // Input values in object notation
  // Checking the assigned metadatasets and parse the node name from input values in object notation
  if (arg!=null && metadatasets!=null){
    for (var i=0; i<metadatasets.length; i++){
      superCDS = metadatasets[i];
    }
    nodePath=objFormat(arg);
  } else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
  }

// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
    // {"nodePath":"Value"}
    var jsonRegex='^\{.*\"\:\"(.*)\"\}$';
    // <nodePath>Value</nodePath>
    var xmlRegex='^\<.*\>(.*)<\/.*\>$';
    // nodePath: Value
    var yamlRegex='^.*\:\ (.*)$';
  	// JSON
    if (obj.match(jsonRegex)!=null) {
      //return JSON.parse(obj);
      nodePath=obj.match(jsonRegex)[1];
      return nodePath;
    }
    // XML
  	else if (obj.match(xmlRegex)!=null) {
      nodePath=obj.match(xmlRegex)[1];
      return nodePath;
    }
    // YAML
    else if (obj.match(yamlRegex)!=null) {
      nodePath=obj.match(yamlRegex)[1];
      return nodePath;
     }
	// Unexpected Inputs
  	else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, the arg object must contains an unique string");
    }
  }

//console.log(subset);
//console.log("nodePath="+nodePath);

// MAIN
// If the node path has been correctly parsed without any error detected so far!
if (nodePath!=null && !errorFound) {
	// transform string into array based on pathSeparator
	nodePathArray=nodePath.split(pathSeparator);
	// we loop through all provided arguments (= nodePaths in the path) and check if the path exist
	// when we get to the last argument we return whole metadataset at that last nodePath.
	for (var i = 0; i < nodePathArray.length; i++) {
	  // check if path is valid and if so store all data in subset
		if (subset.hasOwnProperty(nodePathArray[i]) === true) {
			subset = subset[nodePathArray[i]];
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
	return subset;
}
