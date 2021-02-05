// description: Return names of nodes that are childrens of root node at specified level

// returnChildrensForLevel.js
// Exporter to return the nodes in a CDS that are at specified level from root
// For example, level 1 is direct childrens, level 2 is grand-childrens, ...
//
// This exporter is useful if level X nodes represents different files of a confiquration
// You use first this exporter to get list of nodes=files,
// Then you use returnDataForNode to get the different configuration files
//
// Inputs : an object arg containing an integer representing level to export
//          ex: {"nodelevel": 1 }
// Outputs are: configdataset
//
// Creator:   Anastasia and Dimitris for customer POC
// Version:   1.2
// Support: Sweagle version >= 3.11

// VARIABLES DEFINITION
// Store all the config datasets
var superCDS={};
// Root node string used to concatenate all CDS in superCDS
var rootNode="";
// Defines the node name: placeholder of the provided argument node name
var currentLevel = 0;
var targetLevel = 0;
// Defines the node path array
var nodesFound = [];
// Errors variables
var errorFound = false;
var errors = [];
var errorsDescription = '';


// HANDLERS
// Inputs parser and checker
// Input values in object notation
// Checking the assigned metadatasets and parse the node name from input values
for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}
if (arg.trim()!=""){
  targetLevel = objFormat(arg.trim());
} else if (args[0]!=null) {
  targetLevel = args[0];
} else {
  errorFound=true;
  errors.push("ERROR: No input provided, please provide the node level you want to export");
}

// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
  // {"nodeLevel":Value}
  var jsonRegex='^\{.*\"\:(.*)\}$';
  // <nodePath>Value</nodePath>
  var xmlRegex='^\<.*\>(.*)<\/.*\>$';
  // nodePath: Value
  var yamlRegex='^.*\:\ (.*)$';
	// JSON
  if (obj.match(jsonRegex)!=null) {
    targetLevel=obj.match(jsonRegex)[1];
    return targetLevel;
  }
  // XML
	else if (obj.match(xmlRegex)!=null) {
    targetLevel=obj.match(xmlRegex)[1];
    return targetLevel;
  }
  // YAML
  else if (obj.match(yamlRegex)!=null) {
    targetLevel=obj.match(yamlRegex)[1];
    return targetLevel;
   }
   // no object format, return the string as is
   else { return obj; }
}

//console.log(superCDS);
//console.log("targetLevel="+targetLevel);
//console.log(errorFound);

// MAIN
// If the node path has been correctly parsed without any error detected so far!
if (errorFound) {
	errorsDescription = errors.join(', ');
	return {description: errorsDescription, result:!errorFound};
} else {
  for (var item in superCDS) {
    if (typeof(superCDS[item]) === 'object') {
      if (currentLevel == targetLevel) {
        nodesFound.push(item);
      } else {
        if (hasChildren(superCDS[item]) === true ) { checkChildrent( superCDS[item] ); }
      }
    }
  }
  return nodesFound;
}

// Check if provided subset has children
function hasChildren(subset) {
  for (var i in subset) {
    if (typeof(subset[i]) === 'object') { return true; }
  }
}

// Recursive function to export node at specific level
function checkChildrent( subset ) {
  currentLevel = currentLevel + 1;
  for (var item in subset) {
      if (typeof(subset[item]) === 'object') {
        if (currentLevel == targetLevel) {
          nodesFound.push(item);
        } else {
           if ( hasChildren(subset[item]) === true ) { checkChildrent( subset[item] ); }
        }
      }
  }
  currentLevel = currentLevel - 1;
}
