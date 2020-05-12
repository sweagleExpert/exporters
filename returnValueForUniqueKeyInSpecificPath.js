// description: Return value for key in MDS

/** This exporter takes as argument a full path and keyName and returns the value
 * Argument : path.keyName  : example : PRD1/infra/server03/IP
 */

var nodePathNotFound = false;
var found = false;
var value;
var keyPath = [];
var pathSeparator = "/";
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
  keyPath =  args[0].split(pathSeparator);
} else if (arg!=null && arg!="") {
  // Input values in object notation
  // Checking the assigned config datasets and parse the node name from input values in object notation
  keyPath=objFormat(arg).split(pathSeparator);
} else {
  errorFound=true;
  errors.push("ERROR: No arg with key to search provided !");
}

for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

if (keyPath!=null && !errorFound) { value = findValues (superCDS, keyPath); }
if (errorFound) {
  errors_description = errors.join(', ');
  return {description: errors_description, result:!errorFound};
} else { return value; }


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
      errorFound=true;
      errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
  }
}

function findValues (subset, pathSteps) {
    for (var i = 0; i < pathSteps.length; i++ ) {
      if (subset.hasOwnProperty(pathSteps[i])) {
          subset = subset[pathSteps[i]];
      } else {
          errorFound=true;
          errors.push("ERROR: Path step ("+pathSteps[i]+") not found");
          break;
      }
    }
    return subset;
}
