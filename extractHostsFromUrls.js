// description: Extract all hosts used in MDS URLs values

// extractHostsFromUrls.js
// Exporter to extracts all hosts used in MDS URLs values
//
// No inputs except MDS to parse
// Outputs are: Subset with hostname, then list of hostnames
//
// Creator:   Dimitris for customer POC
// Version:   1.0
//
var domain = "groupama.fr";

var urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
var validUrlRegex = new RegExp(urlExpression);

return findValuesMatchingUrl(metadataset, validUrlRegex);

// Function to match URL in values and extract host from it
function findValuesMatchingUrl(mds, regex, arr=[]) {
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
  var url = new URL(argUrl);
  return url.hostname;
}
