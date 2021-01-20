// description: Return all data for one or multiple nodes names
// returnDataForNodes.js
//
// Inputs are: the nodes names across all assigned CDS
//    Input type: an object arg containing a string
// Outputs are: the data for the specifics nodes names
//    Output type: config datasets
//
// Creator: Dimtris
// Maintainer: Cyrille
// Version:   1.2 - Add retro compatibility
// Support: Sweagle version >= 3.11

// VARIABLES DEFINITION
// Copy the config datasets
var subsets = [];
// Store all the config datasets
var superCDS = {};
// Root node string used to concatenate all CDS in superCDS
var rootNode = "";
// Defines the nodes names: placeholder of the provided argument nodes names
var nodeNamesArray = [];
// Errors variables
var errorFound = false;
var errors = [];
var errors_description = '';


// RULES SPECIFIC VARIABLES
var nodeSeparator = ",";

// HANDLERS
// Inputs parser and checker
if (args[0]!=null) {
  // Input value in old notation (for retro compatibility)
  nodeNamesArray=args;
} else if (arg!=null){
    for (var i=0; i<cds.length; i++){
      rootNode = Object.keys(cds[i])[0];
      superCDS[rootNode] = cds[i][rootNode];
    }
    nodeNamesArray=objFormat(arg.trim());
    //console.log("nodeNamesArray: "+nodeNamesArray);
} else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
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
	// ---
  // nodeName:
	//	-Value1
	//	-Value2
	//	-Value3
    var yamlRegex = /^---\n.*\-(.*?)$/gm;
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
    // No specified format
  	else {
      // Use the Obj string to create array for retro compatibility
      return obj.split(nodeSeparator);
    }
}

// MAIN
// If the node name has been correctly parsed without any error detected so far!
if (nodeNamesArray!=null && !errorFound) {
	// Retrieve the data for the nodes names
	for (var i = 0; i < nodeNamesArray.length; i++) {
		retrieveAllData(superCDS, nodeNamesArray[i]);
	}
  return subsets;
} else {
	errorFound=true;
	errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
}

  // Return the list of all errors trapped
  errors_description = errors.join(', ');
  return {description: errors_description, result:!errorFound};

// FONCTIONS LIST
// Recursive function to retrieve the node name and its all related data.
function retrieveAllData(cds, nodevalue) {
	for (var item in cds) {
	  if (typeof(cds[item]) === 'object') {
  		// If the current node equals the node name
  		if (nodevalue === item) {
  		  // Returns the config dataset for the current node name
  		  subsets[i] = cds[item];
  		} else {
  		  // Continue to search in the next node
  		  retrieveAllData(cds[item], nodevalue);
  		}
    }
	}
}
