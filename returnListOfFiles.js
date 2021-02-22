// description: Return a list of files with their path (file is identified by node with ".")
// returnListOfFiles.js
// Inputs are: None
// Outputs are: array of list of files identified
//
// Creator: Dimtris
// Version:   1.0

// VARIABLES DEFINITION
// Copy the config datasets
var subset = cds;
// Store all the config datasets
var superCDS={};
// Root node string used to concatenate all CDS in superCDS
var rootNode="";
// Defines the node name: placeholder of the provided argument node name
var listOfFiles = [];
// Defines if filename must include full path
var includePath = true;
var pathSeparator = "/";

// HANDLERS
for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

// MAIN
retrieveAllFiles(superCDS, [], 0, pathSeparator);
return listOfFiles;

// FUNCTIONS LIST
// Recursive function to retrieve all files from a related subset
function retrieveAllFiles(subset, prefix, level, pathSeparator) {
  for (var item in subset) {
    if (sweagleUtils.checkIsNode(subset[item])) {
      // If the current nodename contains a '.', we manage it as a filename
      if (item.includes('.')) {
        // Add it to the list of files with the full path
        var pre=".";
        for (var i=1; i<level;i++) { pre = pre + pathSeparator + prefix[i]; }
        var filename=(pre+pathSeparator+item).replace('/./','/');
        listOfFiles.push(filename);
      } else {
        // Recursive search in the node
        prefix[level] = item;
        retrieveAllFiles(subset[item], prefix, level+1, pathSeparator);
      }
    }
  }
}
