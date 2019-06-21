// description: Return the next index value or IP available in specific range or pattern

// returnNextIndex.js
//
// Inputs are
//    - prefix of the pattern to search for
//    - regex of pattern to search for or keyword of pattern
//    keywords list are : ip for next ip address, index to search for next integer value,
//    index[0-9] to search for next index with left padding with specified number of 0
//    - (optional) offset to add to max value found for result calculation (default is 1)
//
// ex: if you want the next hostname following rule "hostprd000 hostprd010 horstprd020",
// you will put args: hostprd index3 10 and function will return hostprd030
//
// Creator:   Anastasia and Dimitris for customer POC
// Version:   1.2 - add offset as optional argument
//

// Default values
var offset = 1;
var padSize = 0;
var maxValue = "";
var ipPattern="(([01]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-4]))"

// Read input arguments
var body = args[0];
var pattern = args[1];
if (! (args[0] && args[1])) {
  return "*** ERROR: NOT ENOUGH ARGUMENTS SUPPLIED: you must provide at least PREFIX and PATTERN ***";
}
if (args[2]) {
    offset = parseInt(args[2]);
}


var fullPattern = new RegExp ("^"+ body + pattern + "$");
if (pattern.toLowerCase() == "ip") {
    fullPattern = new RegExp ("^"+ body + ipPattern + "$");
} else if (pattern.toLowerCase().includes("index")) {
    // check if there is an index value
    var indexValue = pattern.substring(5);
    if (indexValue) {
        padSize = parseInt(indexValue);
        fullPattern = new RegExp ("^"+ body + "[0-9]".repeat(padSize) + "$");
    } else {
        // If no padding, just search for number after prefix
        fullPattern = new RegExp ("^"+ body + "(\\d+)" + "$");
    }
//console.log("fullpattern="+fullPattern);
}


function findObjectKeys(mds) {
  for (var item in mds) {
    if  (typeof (mds[item]) === "object") {
      findObjectKeys (mds[item]);
    }
    else{
      if (fullPattern.test(mds[item]) ) {
        if (maxValue === "") {
          maxValue = mds[item];
        } else {
          var tempValue = mds[item].split(body);
          var tempValue2 = maxValue.split(body);
          if (parseInt(tempValue[1])>parseInt(tempValue2[1])) {
            maxValue = mds[item];
          }
        }
      }
    }
  }
}

findObjectKeys(metadataset);
//console.log("maxValue="+maxValue);


if (maxValue !== "") {
  var finalMaxValue = maxValue.split(body);
  finalMaxValue[1] = parseInt(finalMaxValue[1]) + offset;
  if (padSize > 0) {
    var returnValue = body + pad(finalMaxValue[1],padSize);
  } else {
    var returnValue = body + finalMaxValue[1];
  }
//console.log("returnValue="+returnValue);
  if (fullPattern.test(returnValue)) {
    return returnValue;
  } else {
    return "Out of bounds";
  }
} else {
  return "Not Found";
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
