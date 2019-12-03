// description: Return all tokens used in a MDS, output.replace_tokens.enabled must be set to false in preferences

// findAllTokens.js
//
// No inputs except MDS to parse
// Outputs are: array of tokens found with path if set to true
//
// Creator:   Anastasia, Dimitris for customer POC
// Version:   1.0
var exceptionList= ["KEYNAME"];
// Defines if error must include full path of key found
var includePath = false;
// Defines the max number of errors to return
var maxTokensDisplay = 0;
var allTokens = [];
var tokenRegex =  "{{(.*?)}}";
var globalRegex = new RegExp(tokenRegex,"g");

return findAllTokens(metadataset,'');

// Funtion to find tokens in MDS
function findAllTokens(mds, path) {
	for (var item in mds) {
		if (maxTokensDisplay !==0 && allTokens.length >= maxTokensDisplay) { break; }
		if (typeof mds[item] === 'object') {
			findAllTokens(mds[item], path + item +'/');
		} else if (!exceptionList.includes(item)) {
      // check if there is a token in value
			if ( globalRegex.test(mds[item]) ) {
        // Get list of matches
        var matches = mds[item].match(globalRegex);
        for (var index in matches) {
            //console.log("match="+matches[index]);
            // Get only token name
            var token = matches[index].match(tokenRegex)[1];
            //console.log("token="+token);
            if (includePath) { token = 'token: ' + token + ", path: " + path; }
            else { token = 'token: ' + token; }
            // Check if it doesn't already exists before adding it
            if (allTokens.indexOf(token)===-1) { allTokens.push(token); }
        }
			}
		}
	}
}
