// description: Generate a configMap for Kubernetes
// configMapGenerator.js
//
// Inputs are: the nodes names across all assigned CDS
//    Input type: an object arg containing the list of node names to map with the filenames to expose for the application
//		{"name" : "configmap-name", "namespace" : "configname-namespace",
//			"configMapGenerator" : [
//			{"file":"filename1.properties","nodeNames":["node1","node2","node3"]},
//			{"file":"filename2.properties","nodeNames":["node4"]}
//		]}
// Outputs are: the formatted data for the specifics nodes names retrieved
//    Output type: a standardized configMap
//
// Creator: Cyrille
// Version:   1.0
// Tested on Sweagle version >= 3.20

// VARIABLES DEFINITION
// Copy the config datasets
var subsets = [];
// Store all keys and values as flat list
var flatSubset = {};
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

// SPECIFIC VARIABLES
var configMap = {};
var configmapHeader = {
  	"apiVersion":"v1",
  	"kind":"ConfigMap",
  	"metadata":{
      	"name":"NAME",
      	"namespace" : "NAMESPACE"
    	},
  	"data": "DATA"
	};
var configmapDataPrefix = "|-";

// HANDLERS
// Inputs parser and checker
if (arg!=null){
    for (var i=0; i<cds.length; i++){
      rootNode = Object.keys(cds[i])[0];
      superCDS[rootNode] = cds[i][rootNode];
    }
    var configMapHeader = JSON.parse(arg);
  	var configMapGenerator = JSON.parse(arg).configMapGenerator;
} else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
}


// MAIN
// If the arg has been correctly parsed without any error detected so far!
if (configMapGenerator!=null && !errorFound) {
	// Generate the ConfigMag: add the header
  	configMap = configmapHeader;
    configMap.metadata.name = configMapHeader.name;
    configMap.metadata.namespace = configMapHeader.namespace;
  	// For each entry, search for the data
  	var filedata = {};
	for (var data in configMapGenerator) {
      // Set the filename
      var file = configMapGenerator[data].file;
      // Set the list of nodes to extract
      var nodeNames = configMapGenerator[data].nodeNames;
      //console.log(file+":"+nodeNames);
        for (var i=0; i<nodeNames.length; i++)	{
          retrieveAllData(superCDS, nodeNames[i]);
        }
      // build the data structure for each entry
      filedata[file] = formatting(flattenSubset(subsets, flatSubset),"props");
      //reset the temp structure
      subsets = [];
      flatSubset = {};
	}
  // add all data into the ConfigMap
  configMap.data = filedata;
  return configMap;
} else {
	errorFound=true;
	errors.push("ERROR: Input error!, the input argument (arg) provided cannot be successfully read!");
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

// Return only keys+values of a metadataset, extracting all nodes object
// the extract format is a flat list
function flattenSubset(cds, flatSubset) {
  for (var item in cds) {
    // If the current node equals the node nam
      if (typeof (cds[item]) === "object") {
        // Returns the flatten list of the object
          flatSubset = flattenSubset(cds[item], flatSubset);
      } else {
        // Continue to search in the next node
          flatSubset[item] = cds[item];
      }
  }
  return flatSubset;
}

// Return thr formated object as properties or ini format
function formatting(obj,format){
  var longString = "";
  for (var item in obj) {
    if (format === "props") {
      longString = longString + item + "=" +obj[item] + "\n";
    }
  }
  return longString;
}
