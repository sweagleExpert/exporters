// description: Return all values for a given key excluding specific node

//first argument is either a full keyName : default.calculation-value-attributes.element
//or a value for keyNames ending with the value: **element
//
//second argument is a nodeName that will be excluded from the list: ex aggregator



var allValuesFound = [];
var valuePerKey = {};
var fullPath = "";
var excludedNode = [];
var temp = "";

function findSubstring (mds, partKeyName, excludedNode) {
  for (var item in mds) {
    if  (typeof (mds[item]) === "object" && excludedNode.includes(item) === false) {
      fullPath = fullPath +"/" + item;
      findSubstring (mds[item], partKeyName, excludedNode);

    fullPath = fullPath.split('/').slice(0,-1).join('/') ;
    }
    else if (typeof (mds[item]) !== "object") {
      if (partKeyName.startsWith("**") && !partKeyName.endsWith("**")) {
        temp = partKeyName.split('*').join('');
        if (item.endsWith(temp)) {
          fullPath = fullPath + "/" + item;
          valuePerKey = {
            "fullPath" : fullPath,
            "Keyname" : item,
            "Value" : mds[item]};
            allValuesFound.push(valuePerKey);
            fullPath = fullPath.split('/').slice(0,-1).join('/');
        }
      }
      else if (partKeyName.endsWith("**") && !partKeyName.startsWith("**")) {
        temp = partKeyName.split('*').join('');
        if (item.startsWith(temp)) {
          fullPath = fullPath + "/" + item;
          valuePerKey = {
            "fullPath" : fullPath,
            "Keyname" : item,
            "Value" : mds[item]};
            allValuesFound.push(valuePerKey);
            fullPath = fullPath.split('/').slice(0,-1).join('/');
        }
      }
      else if (!partKeyName.endsWith("**") && !partKeyName.startsWith("**")) {
        if (item === partKeyName) {
          fullPath = fullPath + "/" + item;
          valuePerKey = {
            "fullPath" : fullPath,
            "Keyname" : item,
            "Value" : mds[item]};
          allValuesFound.push(valuePerKey);
          fullPath = fullPath.split('/').slice(0,-1).join('/');
        }
      }
    }
  }
}


if (args[0] != null && args[1] != null) {
  for (var i = 1; i < args.length; i++ ) {
    excludedNode[i-1] = args[i];
  }
  findSubstring (metadataset, args[0], excludedNode);
}
else {
  return "ERROR";
}
return allValuesFound;
