// description: Extract all hosts used in MDS URLs values

// extractHostsFromUrls.js
// Exporter to extracts all hosts used in MDS URLs values
//
// No inputs except MDS to parse
// Outputs are: Subset with hostname, then list of hostnames
//
// Creator:   Dimitris for customer POC
// Version:   1.1 - with subset
//
var urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
var validUrlRegex = new RegExp(urlExpression);
var subset = {};
//var startTime = new Date().getTime();
subset.hosts = findValuesMatchingUrl(metadataset, validUrlRegex, []);
//var endTime = new Date().getTime();
//console.log("duration [ms] = " + (endTime-startTime));
return subset;

// Function to match URL in values and extract host from it
function findValuesMatchingUrl(mds, regex, arr) {
  for (var item in mds) {
    if  (typeof(mds[item]) === "object") {
      // If we are on a node call recursively the function, skipping approved list
      if (item != "approved") { findValuesMatchingUrl (mds[item], regex, arr); }
    } else if (regex.test(mds[item]) ) {
        var host=getHost(mds[item]);
        if (! arr.includes(host)) { arr.push(host); }
      }
  }
  return arr;
}

// Function to extract host from URL
function getHost(argUrl) {
  // Code below doesn't work in live mode
  //var url = new URL(argUrl);
  //return url.hostname;

    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (argUrl.indexOf("//") != -1) { hostname = argUrl.split('/')[2]; }
    else { hostname = argUrl.split('/')[0]; }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}
