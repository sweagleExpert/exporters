// Filter the first CDS to only return the list of keys that are credentials

var credentialsKeys = [];
var includePath = "false";
var tags = [];
var path = "";
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
  includePath=args[0];
} else if (arg!=null && arg!="") {
  // Input values in object notation
  // Checking the assigned config datasets and parse the node name from input values in object notation
  // {"includePath":"true","tags": ["sensitive"]}
  objFormat(arg.trim());
  
} else {
  errorFound=true;
  errors.push("ERROR: No arg with key to search provided !");
}
for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

if (arg!=null && !errorFound) {
  // call the function to find the keyName and return the value
  findSensitiveKeys(superCDS, includePath);

  // return the result or error message
	if (credentialsKeys.length > 1) { return credentialsKeys; }
  	else  { return "ERROR: no credentials keys found"; }
}


errors_description = errors.join(', ');
return {description: errors_description, result:!errorFound};


// FUNCTIONS LIST
// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
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
      includePath=jsonObj.includePath;
      tags=jsonObj.tags;
      break;
    // XML
    case '<':
      includePath=obj.match(xmlRegex)[1];
      break;
    // YAML
    case '-':
      includePath=obj.match(yamlRegex)[1];
      break;
    default:
      errorFound=true;
      errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
  }
}

// recursive function to search credentials keys in subset defined
function findSensitiveKeys(subset, keyPathInfo) {
  for (var item in subset) {
    // check if the key has a value or points to an object
    if  (sweagleUtils.checkIsNode(subset[item])) {
      path = path + item + "/";
      // if value is an object call recursively the function to search this subset of the object
      findSensitiveKeys (subset[item], keyPathInfo);
    } else {
      // check if the key is flagged as Sensitive key
      if (subset[item] == "..." && sweagleUtils.getCdiTags(0) == tags[0]) {
        if (keyPathInfo == "true") {
          credentialsKeys.push(path + item);
        } else {
          credentialsKeys.push(item);
        } 
      }
    }
  }
}