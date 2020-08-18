// description: Return all data in terraform input param for a given unique node name
// add return in gobus format
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
  return metadataset;
}


if (nodesWithSameName === 0) {
  return "ERROR: nodeName not found";
}
else if (nodesWithSameName === 1) {
 var pretext =  "module \"virtualmachine\" { \n";
 var posttext = "}";
 var text="";
 for (var key in subset){
   var text = text +" "+key + " = " + subset[key] + "\n"; 
 }
 var returntext = pretext+text+posttext;
 return returntext;
}
else {
  return "ERROR: multiple nodeNames found";
}
