// description: For each token used, will return the source key used to calculate it (output.replace_tokens.enabled must be set to false in preferences)

// auditTokensSource.js
//
// No inputs except MDS to parse
// Outputs are: list of tokens found with path of the key used to calculate it
//
// Creator:   Dimitris for customer POC
// Version:   1.0
var exceptionList= ["KEYNAME"];
// Defines if error must include full path of key found
var includePath = true;
var pathSeparator = "/";
// Defines the max number of errors to return, if 0 returns all
var maxTokensDisplay = 0;
var allTokens = [];
var result = {};
var resultKeyLevel = {};
//var tokenIdentifier = "{{";
var tokenRegex =  "{{(.*?)}}";
var globalRegex = new RegExp(tokenRegex,"g");

// get all tokens in allTokens array
findAllTokens(metadataset);

// identify root source of each token
for (var i=0; i<allTokens.length; i++) {
	findLastLowestTokenKey(metadataset, allTokens[i], '', 0);
}

return result;

// Funtion to find tokens in MDS
function findAllTokens(mds) {
	for (var item in mds) {
		if (maxTokensDisplay !==0 && allTokens.length >= maxTokensDisplay) { break; }
		if (typeof mds[item] === 'object') {
			findAllTokens(mds[item]);
		} else if (!exceptionList.includes(item)) {
      // check if there is a token in value
			if ( globalRegex.test(mds[item]) ) {
        // Get list of matches
        var matches = mds[item].match(globalRegex);
        for (var index in matches) {
            //console.log("match="+matches[index]);
            // Get only token name
            var token = matches[index].match(tokenRegex)[1];
            // Check if it doesn't already exists before adding it
            if (allTokens.indexOf(token)===-1) { allTokens.push(token); }
        }
			}
		}
	}
}

// Returns the first highest key that has same name as token
function findFirstHighestTokenKey(mds, token, path, level) {
	for (var item in mds) {
		if (typeof mds[item] === 'object') {
			findFirstHighestTokenKey(mds[item], token, path+pathSeparator+item, level+1);
		} else if (item === token) {
          //console.log ("FOUND");
			if (resultKeyLevel[token] === undefined || resultKeyLevel[token] > level) {
				resultKeyLevel[token] = level;
				result[allTokens[i]] = path+pathSeparator+item;
			}
		}
	}
	if (resultKeyLevel[token] === undefined) { result[allTokens[i]] = "ERROR: NOT FOUND"; }
}

// Returns the last highest key that has same name as token
function findLastHighestTokenKey(mds, token, path, level) {
	for (var item in mds) {
		if (typeof mds[item] === 'object') {
			findLastHighestTokenKey(mds[item], token, path+pathSeparator+item, level+1);
		} else if (item === token) {
          //console.log ("FOUND");
			if (resultKeyLevel[token] === undefined || resultKeyLevel[token] >= level) {
				resultKeyLevel[token] = level;
				result[allTokens[i]] = path+pathSeparator+item;
			}
		}
	}
	if (resultKeyLevel[token] === undefined) { result[allTokens[i]] = "ERROR: NOT FOUND"; }
}

// Returns the first lowest key that has same name as token
function findFirstLowestTokenKey(mds, token, path, level) {
	for (var item in mds) {
		if (typeof mds[item] === 'object') {
			findFirstLowestTokenKey(mds[item], token, path+pathSeparator+item, level+1);
		} else if (item === token) {
          //console.log ("FOUND");
			if (resultKeyLevel[token] === undefined || resultKeyLevel[token] < level) {
				resultKeyLevel[token] = level;
				result[allTokens[i]] = path+pathSeparator+item;
			}
		}
	}
	if (resultKeyLevel[token] === undefined) { result[allTokens[i]] = "ERROR: NOT FOUND"; }
}

// Returns the last lowest key that has same name as token
function findLastLowestTokenKey(mds, token, path, level) {
	for (var item in mds) {
		if (typeof mds[item] === 'object') {
			findLastLowestTokenKey(mds[item], token, path+pathSeparator+item, level+1);
		} else if (item === token) {
          //console.log ("FOUND");
			if (resultKeyLevel[token] === undefined || resultKeyLevel[token] <= level) {
				resultKeyLevel[token] = level;
				result[allTokens[i]] = path+pathSeparator+item;
			}
		}
	}
	if (resultKeyLevel[token] === undefined) { result[allTokens[i]] = "ERROR: NOT FOUND"; }
}
