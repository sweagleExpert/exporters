var subset = {};
var nodesWithSameName = 0;
var keysWithSameName = 0;
var allValuesFound = [];
var valuePerKey = {};
var fullPath = "";
var subPath = "";

function findSubstring (mds, args, args1) {
  for (var item in mds) {
    if  (typeof (mds[item]) === "object") {
      fullPath = fullPath +"/" + item;
      if (item === args) {
        nodesWithSameName++;
        subset = mds[item];
        if (args1.startsWith("**") && !args1.endsWith("**")) {
          args1 = args1.split('*').join('');
          endsWithSubstring(subset, args1);
          break;
        }
        else if (!args1.startsWith("**") && args1.endsWith("**")) {
          args1 = args1.split('*').join('');
          startsWithSubstring(subset, args1);
          break;
        }
        else if (args1.startsWith("**") && args1.endsWith("**")){
          args1 = args1.split('*').join('');
          includesSubstring (subset, args1);
          break;
        }
        else if (!args1.startsWith("**") && !args1.endsWith("**")) {
          fullString (subset, args1);
          break;
        }
      }
      findSubstring (mds[item], args, args1); 
      fullPath = fullPath.split(item).join('');
      fullPath = fullPath.slice(0, -1);
    } 
  }
}


function includesSubstring(mds, args1) {
  for (var item in mds) {
    if (typeof (mds[item]) === 'object') {
      subPath = subPath +"/" + item;
      includesSubstring (mds[item], args1);
      subPath = subPath.split(item).join('');
    }
    else {
      if (item.includes(args1)){
        fullPath = fullPath + subPath;
        valuePerKey = {
          "fullpath" : fullPath,
          "Keyname" : item,
          "Value" : mds[item]};
        allValuesFound.push(valuePerKey);
        fullPath = fullPath.split(subPath).join('');
        subPath = subPath.split(item, mds[item]).join('');
        keysWithSameName++;
      }
    }
  }
}

function startsWithSubstring(mds, args1) {
   for (var item in mds) {
    if (typeof (mds[item]) === 'object') {
      subPath = subPath +"/" + item;
      startsWithSubstring (mds[item], args1);
      subPath = subPath.split(item).join('');
    }
    else {
      if (item.startsWith(args1)){
        fullPath = fullPath + subPath;
        valuePerKey = {
          "fullpath" : fullPath,
          "Keyname" : item,
          "Value" : mds[item]};
        allValuesFound.push(valuePerKey);
        fullPath = fullPath.split(subPath).join('');
        subPath = subPath.split(item, mds[item]).join('');
        keysWithSameName++;
      }
    }
  }
}

function endsWithSubstring(mds, args1) {
  for (var item in mds) {
    if (typeof (mds[item]) === 'object') {
      subPath = subPath +"/" + item;
      endsWithSubstring (mds[item], args1);
      subPath = subPath.split(item).join('');
    }
    else {
      if (item.endsWith(args1)){
        fullPath = fullPath + subPath;
        valuePerKey = {
          "fullpath" : fullPath,
          "Keyname" : item,
          "Value" : mds[item]};
        allValuesFound.push(valuePerKey);
        fullPath = fullPath.split(subPath).join('');
        subPath = subPath.split(item, mds[item]).join('');
        keysWithSameName++;
      }
    }
  }
}
function fullString (mds, args1) {
  for (var item in mds) {
    if (typeof (mds[item]) === 'object') {
      subPath = subPath +"/" + item;
      fullString (mds[item], args1);
      subPath = subPath.split(item).join('');
    }
    else {
      if (item === args1){
        fullPath = fullPath + subPath;
        valuePerKey = {
          "fullpath" : fullPath,
          "Keyname" : item,
          "Value" : mds[item]};
        allValuesFound.push(valuePerKey);
        fullPath = fullPath.split(subPath).join('');
        subPath = subPath.split(item, mds[item]).join('');
        keysWithSameName++;
      }
    }
  }
}


if (args[0] != null && args[1] != null) {
  for (var i = 1; i < args.length; i++ ) {
    fullPath = "";
    findSubstring(metadataset,args[0], args[i]);
  }
}
else {
  return "ERROR: no keyName or nodeName provided";
}


if (nodesWithSameName === 0){
  return "ERROR: nodeName not found";
}
else if (nodesWithSameName > (args.length - 1)) {
  return "ERROR: multiple nodes found";
}

if (keysWithSameName === 0 ) {
  return "ERROR: keyName not found";
}

return allValuesFound;
