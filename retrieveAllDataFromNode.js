var subset = metadataset;
var nodesWithSameName = 0;


function retrieveAllData(mds, args) {

  for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
      if (args === item) {
        nodesWithSameName = nodesWithSameName + 1;
        subset = mds[item];       
      }
      else {
        retrieveAllData(mds[item], args);
      }
    }
  }
}


if (args[0]!=null) {
  retrieveAllData(metadataset, args[0]);
}
else {
  return "ERROR: no keyName provided"; 
}


if (nodesWithSameName === 0) {
  return "ERROR: nodeName not found";
}
else if (nodesWithSameName === 1) {
  return subset;
}
else {
  return "ERROR: multiple nodeNames found";
}