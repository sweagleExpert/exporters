var subset = metadataset;
 
var found = [];
var uniqueKeyname = [];
var nodeFound = 0;
 
/**
 * returnValue function searches the whole metadataset to find the MDI value for a given MDI keyName at the given nodeName.
 * mds must be the given metadataset, args must be the nodeNAme, args1 must be the keyName
 */
 
function returnValue(mds, args, args1) {
  for (var item in mds) {
    // check if the key has a value or points to an object
    if (typeof(mds[item]) === 'object') {
      //check if the node equals to the search term
      if (args === item) {
        nodeFound++;
        subset = mds[item]; 
        //check if the node has a key equal to the search term
        if (subset.hasOwnProperty(args1)) {
          found.push(subset[args1]);
        }
      }
        // if value is an object call recursively the function to search this subset of the object
        returnValue(mds[item], args, args1);
    }
  }
}
 
 
 
 
 
// here we call our function
if (args[0] != null && args[1] != null) {
  returnValue(metadataset, args[0], args[1]);
}
else {
  return "ERROR: no keyName or nodeName provided";
}
 
//If the nodeName does not exist, return error
if (nodeFound === 0){
  return "ERROR: nodeName not found";
}
//If the keyName does not exist, return error
if (found.length === 0) {
  return "ERROR: keyName not found";
}
else if (found.length === 1) {
  return found[0];
}
else {
//Check if the keyName is uniqueKeyname
for (var i=0; i<found.length; i++) {
  if (uniqueKeyname.indexOf(found[i]) < 0) {
    uniqueKeyname.push(found[i]);
  }
}
//if the keyName is not uniqueKeyname, return error
if (uniqueKeyname.length > 1) {
  return "ERROR: " + uniqueKeyname.length +" different values are found";
}
 
return found[0];
}