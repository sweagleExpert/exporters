// description: Return names of nodes that are childrens of root node at specified level

// returnChildrensForLevel.js
// Exporter to return the nodes in a MetaDataSet that are at specified level from root
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
// Checking the assigned metadatasets and parse the node name from input values in object notation
if (arg!=null && metadatasets!=null){
  for (var i=0; i<metadatasets.length; i++){
    rootNode = Object.keys(metadatasets[i])[0];
    superCDS[rootNode] = metadatasets[i][rootNode];
  }
  targetLevel=objFormat(arg);
} else {
  errorFound=true;
  errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
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
  // Unexpected Inputs
	else {
    errorFound=true;
    errors.push("ERROR: Inputs unexpected!, the arg object must contains an unique integer");
  }
}

//console.log(superCDS);
//console.log("targetLevel="+targetLevel);

// MAIN
// If the node path has been correctly parsed without any error detected so far!
if (targetLevel!=null && !errorFound) {
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

if (errorFound) {
	// Return the list of all errors trapped
	errorsDescription = errors.join(', ');
	return {description: errorsDescription, result:!errorFound};
} else {
	return superCDS;
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
