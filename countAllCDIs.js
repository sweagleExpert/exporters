// countAllCDIs.js
// Description: Return the total count of CDIs in the CDS and for each subnodes.

var subset = cds[0];
var arrayNbOfCDIs = [];
var rootNode = Object.keys(subset)[0];
var envs = Object.keys(subset[rootNode]);
var nbOfCDIs = 0;
var nbOfIncludedCDIs = 0;
var arrayPath = [];

// Count all CDIs for an object within the CDS
function countAllData(dataset, arrayPath) {
  for (var item in dataset) {
    // if the item is a node - recursive call
    if (typeof(dataset[item]) === 'object') {
      //Add a node to save the node path	
      arrayPath.push(item);
		countAllData(dataset[item], arrayPath);
    } 
    else {
		// Check if the node it is an Include, meaning there are duplicated CDIs in the CDS.
		if (isIncludeNode(arrayPath)){
      		nbOfIncludedCDIs = nbOfIncludedCDIs + 1;
    	}
      	// BTW, count all CDIs in the CDS
    	nbOfCDIs = nbOfCDIs + 1;
      }
   }
  // Remove last node name of the path
   arrayPath.pop();
}

// Check if the node is included or not
function isIncludeNode (path) {
  var nodePath = path.join(",");
  var nodeMetadatas = sweagleUtils.getNodeMetaDataByPath(nodePath);
  for (var metadata in nodeMetadatas) {
    if (metadata === "isInclude"){ 
      if (nodeMetadatas[metadata]) { return true; }
      else { return false; }
      break;
  	}
  }
}

// Count the total of CDIs
countAllData(subset, arrayPath);
arrayNbOfCDIs.push("Total number of CDIs = "+nbOfCDIs);
arrayNbOfCDIs.push("Total number of Included CDIs = "+nbOfIncludedCDIs+" ("+((nbOfIncludedCDIs/nbOfCDIs)*100).toFixed(0)+"%)");
// For each first subnodes count all CDIs
for (var i=0; i<envs.length; i++) {
  nbOfCDIs = 0;
  countAllData(subset[rootNode][envs[i]], arrayPath);
  arrayNbOfCDIs.push("->"+envs[i]+", number of CDIs = "+nbOfCDIs);
}
// return the array containing all the CDIs counting
return arrayNbOfCDIs;