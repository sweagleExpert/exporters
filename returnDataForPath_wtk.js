// description: Return all data for a given path with tokens in key or node names also calculated

// Exporter to return all data (= all MDI and all childNodes + their MDIs)
//
// provide as arguments all nodes that when combined provide the exact path for which
// all data needs to be retrieved.
// Each nodeName in the path must be provided as a separate argument value
// When no argument is provided then ALL data from the metadata set is returned
var tokenSeparator = "@@";
var regex = tokenSeparator+"(.*?)"+tokenSeparator;
var globalRegex = new RegExp(regex,"g");

var subset = metadataset;

// we loop through all provided arguments (= nodeNames in the path) and check if the path exist
// when we get to the last argument we return whole metadataset at that last nodeName.

for (var i = 0; i < args.length; i++) {
    	// check if path is valid and if so store all data in subset
	if (subset.hasOwnProperty(args[i]) === true) {
		subset = subset[args[i]];
	} else {
	// if not valid return error message
		return "ERROR: path not found: " + args[i];
	}
// keep looping through the provided arguments.
// when last node is reached, subset contains the data we are looking for
}
return replaceKeyTokens(subset);


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
