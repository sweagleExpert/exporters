// description: Return all orphans keys in a MDS, orphans are keys not used in any tokens (output.replace_tokens.enabled must be set to false in preferences)
// keys that contains tokens in their value are ignored

// findAllOrphans.js
//
// No inputs except MDS to parse
// Outputs are: array of orphans keys found with path if set to true
//
// Creator:   Anastasia, Dimitris for customer POC
// Version:   1.0

// defines list of keys or nodes to ignore in check
var exceptionList= ["KEYNAME"];
// Defines if error must include full path of key found
var includePath = true;
// Defines the max number of errors to return
var maxTokensDisplay = 0;
var allTokens = [];
var allKeys = [];
var keysNotUsedInTokens = [];
var tokenRegex =  "{{(.*?)}}";
var globalRegex = new RegExp(tokenRegex,"g");

findAllTokensAndKeys(metadataset,'');

//console.log(allTokens);
//console.log(allKeys);

var keyNotFound = false;
for (var i=0; i < allKeys.length; i++) {
	for (var j=0; j < allTokens.length; j++) {
      	//console.log("key="+allKeys[i].keyName);
		if (allTokens.indexOf(allKeys[i].keyName)===-1) { keyNotFound =  true; break; }
	}
	if (keyNotFound) { keysNotUsedInTokens.push(allKeys[i]); }
	if ( maxTokensDisplay !==0 && keysNotUsedInTokens.length >= maxTokensDisplay) { break;}
	keyNotFound = false;
}

return keysNotUsedInTokens;


// Funtion to find tokens or keys in MDS
function findAllTokensAndKeys(mds, path) {
	for (var item in mds) {
		if (maxTokensDisplay !==0 && allTokens.length >= maxTokensDisplay) { break; }
		if (!exceptionList.includes(item)) {
      if (typeof mds[item] === 'object') {
        findAllTokensAndKeys(mds[item], path + item +'/');
		  } else if ( globalRegex.test(mds[item]) ) {
        // this key has a tokenized value, register it in tokenArray
        // Get list of matches
        var matches = mds[item].match(globalRegex);
        for (var index in matches) {
          //console.log("match="+matches[index]);
          // Get only token name
          var token = matches[index].match(tokenRegex)[1];
          //console.log("token="+token);
          // Check if it doesn't already exists before adding it
          if (allTokens.indexOf(token)===-1) { allTokens.push(token); }
        }
			} else {
				// this value has no token, register key in allKeys array
        		var tempkey = {};
				if (includePath) { tempkey = {'keyName': item, 'path': path}; }
				else { tempkey = {'keyName': item}; }
				if (allTokens.indexOf(tempkey)===-1) { allKeys.push(tempkey); }
			}
		}
	}
}
