// description: Return all data in Terraform TFVARS (HCL format) for a given unique node name
// tfvarsGenerator.js
//
// PREREQUISITES
//	A sequence of values or a list must represented as:
// 	keyName = keyValue1,keyValue2,keyValue3
//  here the seperator of the string value is comma ","
//
// Inputs are: the UNIQUE node name across all assigned CDS
//    Input type: an object arg containing a string
// Outputs are: data for the specific node name
//    Output type: a pre-formated *.tfvars file in HCL
//
// Creator: Cyrille Rivière
// Version:   1.0 - first exporter release
// Support: Tested on version >= 3.22

// VARIABLES DEFINITION
// Copy the config datasets
var subset = cds;
// Store all the config datasets
var superCDS={};
// Root node string used to concatenate all CDS in superCDS
var rootNode="";
// Number of occurences of the node name found witin the config datasets
var nodesWithSameName = 0;
// Defines the node name: placeholder of the provided argument node name
var nodeName = "";
// Errors variables
var errorFound = false;
var errors = [];
var errors_description = '';

// HANDLERS
// Inputs parser and checker
if (args[0]!=null) {
  // Input value in old notation (for retro compatibility)
  nodeName=args[0];
} else if (arg!=null && arg!="") {
  // Input values in object notation
  // Checking the assigned config datasets and parse the node name from input values in object notation
  nodeName=objFormat(arg.trim());
} else {
  // If no input is provided then return main cds (for retro compatibility)
  errorFound=true;
  errors.push("ERROR: No inputs provided! Please provide at least one cds and one arg in object notation.");
}

for (var i=0; i<cds.length; i++){
  rootNode = Object.keys(cds[i])[0];
  superCDS[rootNode] = cds[i][rootNode];
}

// Parse the object notation: check upon against the RegEx format
function objFormat(obj) {
  var matches, index;
  // {
  // 	"nodeName" : ["Value1"]
  // }
  var jsonRegex = /\"(.*?)\"/gm;
	//<nodeName>Value1</nodeName>
  var xmlRegex = /\<.*\>(.*?)<\/.*\>/gm;
// ---
// nodeName:
//	-Value1
  var yamlRegex = /^---\n.*\-(.*?)$/gm;
  // JSON
  if (jsonRegex.test(obj)) {
    //console.log("json");
    matches = JSON.parse(obj);
    return matches.nodeName;
  }
  // XML
  else if (xmlRegex.test(obj)) {
    //console.log("xml");
    return obj.match(xmlRegex)[1];
  }
  // YAML
  else if (yamlRegex.test(obj)) {
    //console.log("yaml");
    return obj.match(yamlRegex)[1];
  }
  // no object format, return the string as is
  else {
    //console.log("object");
    return obj;
  }
}
//console.log("nodeName="+nodeName);
//console.log("errorFound="+errorFound);
//console.log("nodesWithSameName="+nodesWithSameName);

// MAIN
// If the node name has been correctly parsed without any error detected so far!
if (nodeName!=null && !errorFound) {
  // Retrieve the UNIQUE data for the node name
  retrieveAllData(superCDS, nodeName);
  // Checks if the node name occurences witin the config dataset
  if (nodesWithSameName === 0) {
    errorFound=true;
    errors.push("ERROR: nodeName: "+nodeName+" not found");
    // If only one node name occurrence has been found returns the subset data
  } else if (nodesWithSameName === 1) {
    var pretext =  "{ \n";
    var posttext = "}";
    var text="";
    var text = iterate(subset);
    var returntext = text.replace(/,\s*$/, "");  //remove last comma
    return returntext;
  } else {
    errorFound=true;
    errors.push("ERROR: multiple nodeNames: "+nodeName+" found");
  }
} else {
  errorFound=true;
  errors.push("ERROR: Inputs unexpected!, please provide an object notation (arg). Inputs variables list (args[]) is deprecated.");
}
// Return the list of all errors trapped
errors_description = errors.join(', ');
return {description: errors_description, result:!errorFound};

// FUNCTIONS LIST
// Recursive function to retrieve the node name and its all related data.
function retrieveAllData(dataset, nodevalue) {
  for (var item in dataset) {
    if (typeof(dataset[item]) === 'object') {
      // If the current node equals the node name
      if (nodevalue === item) {
        nodesWithSameName = nodesWithSameName + 1;
        // Returns the config dataset for the current node name
        subset = dataset[item];
      } else {
        // Recursive search in the node
        retrieveAllData(dataset[item], nodevalue);
      }
    }
  }
}
// Parse the CDS and build the output
function iterate(obj) {
    for (var key in obj) {
	//console.log("key: "+key+", value: "+obj[key]+", type: "+Object.prototype.toString.call(obj[key]));
      if (typeof obj[key] === "object") {
        // Start JSON obj notation
        text = text +" "+ key + " = " + '{' + "\n";
        iterate(obj[key]);
        // End JSON obj notation
      	text = text +" "+ '}' + "\n";
      } else {
        // If the JSON obj contains an array (list)
        //console.log("key: "+key+", value: "+obj[key]);
        if (isArray(obj[key]).length > 1) {
          // Start array notation
          text = text +"\t"+ returnValueType(key) + " = " + '[' + "\n";
          // For each array element
          for (var i=0; i<isArray(obj[key]).length; i++) {
            text = text +"\t\t"+ returnValueType(isArray(obj[key])[i].trim()) + ',' + "\n";
          }
          // End array notation
          text = text +"\t"+ '],' + "\n";
        }
        // Else the JSON obj contains K/V pairs
        else{
          text = text +"\t"+ JSON.stringify(key) + " = " + returnValueType(obj[key]) + "," + "\n";
        }
      }
    }

    return text;
}

// Check if the key value is an array
function isArray(keyValue) {
  var separator = ",";
  var lengthArray = keyValue.split(separator).length;
  if (lengthArray > 0) { 
    return keyValue.split(separator); 
  }
}

// Return the type of value
function returnValueType (keyValue) {
  if (keyValue == "true" || keyValue == "false") {Boolean(keyValue);}
  else if (isNormalInteger(keyValue)) {return Number(keyValue);}
  else {return JSON.stringify(keyValue);}
}

// Return true if the value is an Integer
function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}
