// description: Return names of nodes that are childrens of root node at specified level

// returnChildrensForLevel.js
// Exporter to return the nodes in a MetaDataSet that are at specified level from root
// For example, level 1 is direct childrens, level 2 is grand-childrens, ...
//
// This exporter is useful if level X nodes represents different files of a confiquration
// You use first this exporter to get list of nodes=files,
// Then you use retrieveAllDataFromNode to get the different configuration files
//
// Inputs : Integer representing level to export (1, 2, ...)
// Outputs are: Array of children nodes names
//
// Creator:   Anastasia and Dimitris for customer POC
// Version:   1.0
//
var mds = metadataset;
var nodesFound = [];
var currentLevel = -1;
var targetLevel = 0;

if (args[0]!=null) {
  targetLevel = args[0];
}
else {
  return "ERROR: no level provided";
}


// Check if provided subset has children
function hasChildren(subset) {
  for (var i in subset) {
    if (typeof(subset[i]) === 'object') { return true; }
  }
}

function checkChildrent( subset ) {
    currentLevel = currentLevel + 1;
    for (var item in subset) {
        if (typeof(subset[item]) === 'object') {
          if (currentLevel == targetLevel) {
            nodesFound.push(item);
          } else {
             if ( hasChildren(subset[item]) === true ) {
                 checkChildrent( subset[item] );
             }
          }
        }
    }
    currentLevel = currentLevel - 1;
}

currentLevel = currentLevel + 1;
for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
      if (currentLevel == targetLevel) {
        nodesFound.push(item);
      } else {
        if ( hasChildren(mds[item]) === true ) {
            checkChildrent( mds[item] );
        }
      }
    }
}

return nodesFound;
