// Return all key values with tokens in key or node names also calculated
var tokenSeparator = "@@";
var regex = tokenSeparator+"(.*?)"+tokenSeparator;
var globalRegex = new RegExp(regex,"g");

return replaceKeyTokens(metadataset);

// Replace all tokens found in key or node names by their value
function replaceKeyTokens(mds) {
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
                var token = matches[index].match(regex)[1];
                //console.log("token="+token);
                var tokenValue = getKeyValueByName(metadataset, token);
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
