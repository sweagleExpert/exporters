// description: Return value for key

/** Find out the value for a specific key that is provided as an argument
* in case keyName is not found - return error
* in case keyName is found multiple times - return error
* in case keyName is found once - return value
*/

var searches = {};
var keysWithSameName = 0;
var keyname = "";
var rootNode = "";
var superCDS = {};
// Errors variables
var errorFound = false;
var errors = [];
var errors_description = '';

// HANDLERS
// Inputs parser and checker
if (args[0]!=null) {
  // Input value in old notation (for retro compatibility)
  keyname=args[0];
} else if (arg!=null && arg!="") {
  // Input values in object notation
  // Checking the assigned config datasets and parse the node name from input values in object notation
  keyname=objFormat(arg.trim());
} else {
  errorFound=true;
  errors.push("ERROR: No arg with key to search provided !");
}
for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

if (keyname!=null && !errorFound) {
  // call the function to find the keyName and return the value
  findObjectKeys(superCDS, keyname);

  // return the result or error message
  if (keysWithSameName > 1) { return "ERROR: "+keysWithSameName+" keyNames ("+keyname+") found"; }
  else if (keysWithSameName == 1) { return searches[keyname]; }
  else  { return "ERROR: keyname ("+keyname+") not found"; }
}


errors_description = errors.join(', ');
return {description: errors_description, result:!errorFound};


// FUNCTIONS LIST
// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
  var valueToCheck;
  // <nodeName>Value</nodeName>
  var xmlRegex='^\<.*\>(.*)<\/.*\>$';
  // ---
  //nodeName: Value
  var yamlRegex='^---\n.*\:\ (.*)$';
  switch (obj.charAt(0)) {
	  // JSON
    case '{':
    case '[':
      var jsonObj=JSON.parse(obj);
      for (var key in jsonObj) { valueToCheck = jsonObj[key]; }
      return valueToCheck;
    // XML
    case '<':
      valueToCheck=obj.match(xmlRegex)[1];
      return valueToCheck;
    // YAML
    case '-':
      valueToCheck=obj.match(yamlRegex)[1];
      return valueToCheck;
    default:
      // if no format detected return the full string to be retro compatible with old releases
      return obj;
  }
}

// recursive function to search value of specific key in subset defined
function findObjectKeys(subset, searchKey) {
  if (searches.hasOwnProperty(searchKey) === false) {
    searches[searchKey] = "ERROR: not found";
  }
  for (var item in subset) {
    // check if the key has a value or points to an object
    if  (typeof (subset[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      findObjectKeys (subset[item], searchKey);
    } else {
      // check if the key equals to the search term
      if (item === searchKey ) {
        searches[searchKey] = subset[item];
        keysWithSameName = keysWithSameName + 1;
        break;
      }
    }
  }
}
