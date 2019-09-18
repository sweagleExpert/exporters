// description: Return all data for a given node name, stopping at first node found

var subset = metadataset;
var nodesWithSameName = 0;

if (args[0]!=null) {
  subset = retrieveAllData(metadataset, args[0]);
} else {
  // If no name provided, return the full metadataset
  return metadataset;
}

if (nodesWithSameName === 0) {
  return "ERROR: nodeName not found";
}

return subset;


// Function to retrieve a node based on its name
// Function stopped at first node found with correct name
function retrieveAllData(mds, argName) {
  for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
      if (item === argName) {
        nodesWithSameName = nodesWithSameName + 1;
        return mds[item];
      } else {
        retrieveAllData(mds[item], argName);
      }
    }
  }
}
