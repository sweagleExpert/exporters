// description: Replace all index values in MDS by their values

// ex: search MDS for ##INDEX[1-9]?## Regex
// If found, will search in MDS for similar prefix and calculate next index
// It will use INDEX(number) as padding if provided, or no padding if not provided

// fillMdsIndex.js
//
var maxValue="";
var indexRegex = new RegExp ("##INDEX[1-9]?##");

fillIndex(metadataset);

return metadataset;

// Replace any ##INDEX[pad]## found by the next index found for this value
function fillIndex(mds) {
  for (var item in mds) {
    // check if the key has a value or points to an object
    if  (typeof (mds[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      fillIndex(mds[item]);
    } else {
      // check if the key equals to the search term
      if (indexRegex.test(mds[item])) {
        var position = mds[item].indexOf('##INDEX') + 7;
        var padSize = mds[item].substring(position, position + 1);
        if (padSize == "#") {
          mds[item] = mds[item].replace("##INDEX##","");
          mds[item] = calculateIndex(mds[item],0);
        } else {
          mds[item] = mds[item].replace("##INDEX"+padSize+"##","");
          mds[item] = calculateIndex(mds[item],parseInt(padSize));
        }
      }
    }
  }
}


function calculateIndex(body, padSize) {
//console.log("body="+body);
//console.log("padSize="+padSize);
    maxValue=""
    if (padSize > 0) {
        var fullPattern = new RegExp ("^"+ body + "[0-9]".repeat(padSize) + "$");
    } else {
        // If no padding, just search for number after prefix
        var fullPattern = new RegExp ("^"+ body + "(\\d+)" + "$");
    }
    findObjectKeys(metadataset, body, fullPattern);
//console.log("maxValue="+maxValue);
    if (maxValue !== "") {
      var finalMaxValue = maxValue.split(body);
      finalMaxValue[1] = parseInt(finalMaxValue[1]) + 1;
      if (padSize > 0) { var returnValue = body + pad(finalMaxValue[1],padSize); }
      else { var returnValue = body + finalMaxValue[1]; }
//console.log("returnValue="+returnValue);
      if (fullPattern.test(returnValue)) { return returnValue; }
      else { return "Out of bounds"; }
    } else { return body + pad(1,padSize); }
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function findObjectKeys(mds, body, pattern) {
  for (var item in mds) {
    if  (typeof (mds[item]) === "object") {
      findObjectKeys (mds[item], body, pattern);
    } else {
      if (pattern.test(mds[item]) ) {
        if (maxValue === "") { maxValue = mds[item]; }
        else {
          var tempValue = mds[item].split(body);
          var tempValue2 = maxValue.split(body);
          if (parseInt(tempValue[1])>parseInt(tempValue2[1])) { maxValue = mds[item]; }
        }
      }
    }
  }
}
