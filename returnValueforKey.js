/** Find out the value for a specific key that is provided as an argument
* in case keyName is not found - return error
* in case keyName is found multiple times - return error
* in case keyName is found once - return value
*/

var searches = {};
var keysWithSameName = 0;

/**
* mds must be the given metadataset,
* searchKey must be the string we want to check in the keys
*/
function findObjectKeys(mds, searchKey) {
  if (searches.hasOwnProperty(searchKey) === false) {
    searches[searchKey] = "ERROR: not found";
  }
  for (var item in mds) {
    // check if the key has a value or points to an object
    if  (typeof (mds[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      findObjectKeys (mds[item], searchKey);
    }
    else{
      // check if the key equals to the search term
      if (item === searchKey ) {
        searches[searchKey] = mds[item];
        keysWithSameName = keysWithSameName + 1;
        break;
      }
    }
  }
}

// call the function to find the keyName and return the value 
if (args[0]!=null) {
  findObjectKeys(metadataset, args[0]);
}
else {
  return "ERROR: no keyName provided";  
}

// return the result or error message
if (keysWithSameName > 1) {
    return "ERROR: multiple keyNames found";
}
else if (keysWithSameName == 1) {
    return searches[args[0]];
}
else  {
    return "ERROR: keyname not found";
}
