// description: Return names of nodes that are the last in terms of hierarchy level

// returnChildrensLastLvl.js
// Exporter to return the last nodes in a MetaDataSet
// Last nodes are identified by the fact they have no childrens
//
// This exporter is useful if last nodes represents different files of a confiquration
// You use first this exporter to get list of nodes=files,
// Then you use returnDataForNode to get the different configuration files
//
// No inputs except MDS to parse
// Outputs are: Array of children nodes names
//
// Creator:   Anastasia and Dimitris for customer POC
// Version:   1.0
//
var mds = metadataset;
var nodesFound = [];

// Check if provided subset has children
function hasChildren(subset) {
  for (var i in subset) {
    if (typeof(subset[i]) === 'object') { return true; }
  }
}

function checkChildrent( subset ) {
    for (var item in subset) {
        if (typeof(subset[item]) === 'object') {
             if ( hasChildren(subset[item]) === true ) {
                 checkChildrent( subset[item] );
             } else {
                 nodesFound.push(item);
             }
        }
    }
}

for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
         if ( hasChildren(mds[item]) === true ) {
             checkChildrent( mds[item] );
         } else {
             nodesFound.push(item);
         }
    }
}

return nodesFound;
