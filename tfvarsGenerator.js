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
//    Output type: a post-formated *.tfvars file in HCL
//    https://www.terraform.io/docs/language/expressions/types.html
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
// Others
var parent=null;

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
    var text = json2hcl(subset);
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
// Parse the CDS objects (JSON output) and build the HCL output for tfvars format
function json2hcl(obj) {
    for (var key in obj) {
    //if the key value is an object. Process with different uses cases upon children
      if (typeof obj[key] === "object") {
        //console.log("key="+key+", obj[key]="+obj[key]);
        //console.log("key="+key+" hasChildren="+hasChildren(obj[key]));
        //console.log("key="+key+" hasGrandChildren="+hasGrandChildren(obj[key]));
        //console.log("key="+key+" getGrandChildren="+getGrandChildren(obj[key]));
        // If the key value is vars{}: delete it!
        if (key === 'vars') {
          delete obj[key];
        }
        // If the json obj contains a list (an array, a tuple)
        else if (hasChildren(obj[key]) && !hasGrandChildren(obj[key])) {
          var singleNodes = getGrandChildren(obj[key]);
          // Start array notation
          text = text +"\t"+ hclValueType(key) + " = " + '[' + "\n";
          // For each array element
          for (var i=0; i<singleNodes.length; i++) {
            //console.log("singleNodes["+i+"]="+singleNodes[i]);
            if (i==singleNodes.length-1) {text = text +"\t\t"+ hclValueType(singleNodes[i]) + "\n";}
            else {text = text +"\t\t"+  hclValueType(singleNodes[i]) + ',' + "\n";}
          }
          // End array notation
          text = text +"\t"+ '],' + "\n";
          // Reset the array storing the list of elements
          singleNodes = [];
        }
        // the json obj contains another map/object
        else {
          // Start JSON obj notation
          text = text + key + " = " + '{' + "\n";
          json2hcl(obj[key]);
          // End JSON obj notation
          text = text +" "+ '}' + "\n";
        }
      }
      // the K/V pair is not an object
      else {
        // the K/V pair is included into a map/object
        if (hasParent(subset,key)) {
          var lastKey = Object.keys(obj)[Object.keys(obj).length-1];
          // If it is the last key of the map/object
          if (key===lastKey) {text = text + "\t" + JSON.stringify(key) + " = " + hclValueType(obj[key]) + "\n";}
          else {text = text + "\t" + JSON.stringify(key) + " = " + hclValueType(obj[key]) + "," + "\n";}
        } 
        // the K/V pair is not included into a map/object
        else {
        text = text + key + " = " + hclValueType(obj[key]) + "\n";
        }
      }  
    }
    return text;
}

// Check if provided subset has children
function hasParent(subset,key) {
  for (var i in subset) {
    //console.log("Parent["+i+"]="+subset[i]);
    if (typeof(subset[i]) === 'object') {
      hasParent(subset[i],key);
    }
    else {
     if (i===key) {return false;} 
    }
  }
  return true;
}

// Check if provided subset has children
function hasChildren(subset) {
  for (var i in subset) {
    //console.log("Child["+i+"]="+subset[i]);
    if (typeof(subset[i]) === 'object') { return true; }
  }
  return false;
}

// Check if provided subset has grandchildren
function hasGrandChildren(subset) {
  for (var i in subset) {
    //console.log("GrandChild["+i+"]="+subset[i]);
    if (typeof(subset[i]) === 'object') { 
    	if (hasChildren(subset[i])) {return true;}
    }
  }
  return false;
}

// Return the list of single nodes (that has no children)
function getGrandChildren(subset) {
  var singleNodes = []; 
  for (var item in subset) {
      if (typeof(subset[item]) === 'object') {
           if (!hasGrandChildren(subset[item])) {
               singleNodes.push(item);
           }
      }
  }
  return singleNodes;
}

// Return the HCL type of value
function hclValueType (keyValue) {
  if (keyValue == "true" || keyValue == "false") {Boolean(keyValue);}
  else if (isNormalInteger(keyValue)) {return Number(keyValue);}
  else {return JSON.stringify(keyValue);}
}

// Return true if the value is an Integer
function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}
