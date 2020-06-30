// description: Return all data for a given unique node name with tokens in key or node names also calculated
var tokenSeparator = "@@";
var regex = tokenSeparator+"(.*?)"+tokenSeparator;
var globalRegex = new RegExp(regex,"g");

var subset = metadataset;
var nodesWithSameName = 0;

if (arg) { retrieveAllData(metadataset, arg); }
else if (args[0] != null) { retrieveAllData(metadataset, args[0]); }
else { return replaceKeyTokens(metadataset); }

if (nodesWithSameName === 0) {
  return "ERROR: nodeName not found";
} else if (nodesWithSameName === 1) {
  return replaceKeyTokens(subset);
} else {
  return "ERROR: multiple nodeNames found";
}

// Replace all tokens found in key or node names by their value
function replaceKeyTokens(mds) {
    var token = "";
    var tokenValue = "";
    for (var item in mds) {
        // check if the key has a value or points to an object
        if  (typeof (mds[item]) === "object") {
          // if value is an object call recursively the function to search this subset of the object
          mds[item] = replaceKeyTokens(mds[item]);
        }
        // Check if keyname contains a token
        if (item.match(regex)) {
            var itemReplaced = item;
            // Get list of matches
            var matches = item.match(globalRegex)
            for (var index in matches) {
               // console.log("match="+matches[index]);
                // Get only token value
                token = matches[index].match(regex)[1];
                //console.log("token="+token);
                tokenValue = getKeyValueByName(metadataset, token);
                //console.log("tokenValue="+tokenValue);

                if (tokenValue !== "ERROR: NOT FOUND") {
                    itemReplaced = itemReplaced.replace(tokenSeparator+token+tokenSeparator,tokenValue);
                }
            }
            mds[itemReplaced]=mds[item];
            delete mds[item];
        }
    }
    return mds;
}

// Return a Key value based on its name
function getKeyValueByName(mds, keyName) {
  var value = "ERROR: NOT FOUND";
  for (var item in mds) {
    // check if the key has a value or points to an object
    if  (typeof (mds[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      value = getKeyValueByName(mds[item], keyName);
      if (value != "ERROR: NOT FOUND") { return value; }
    } else {
      // check if the key equals to the search term
      if (item === keyName ) { return mds[item]; }
    }
  }
  return value;
}

function retrieveAllData(mds, args) {
  for (var item in mds) {
    if (typeof(mds[item]) === 'object') {
      if (args === item) {
        nodesWithSameName = nodesWithSameName + 1;
        subset = mds[item];
      } else {
        retrieveAllData(mds[item], args);
      }
    }
  }
}
