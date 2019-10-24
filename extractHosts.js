// description: Extract all hosts used in MDS values (hosts in specific domain)

// extractHosts.js
// Exporter to extracts all hosts used in MDS values (direct hostnames)
//
// No inputs except MDS to parse
// Outputs are: Subset with hostname: <list of hostnames>
//
// Creator:   Dimitris for customer POC
// Version:   1.0
//
var domain = "groupama.fr";
var validHostRegex = new RegExp ("^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*."+domain+"$");

return findValuesMatchingRegex(metadataset, validHostRegex);

// Function to return all values matching a specific regex in an array
function findValuesMatchingRegex(mds, regex, arr=[]) {
  for (var item in mds) {
    if  (typeof(mds[item]) === "object") {
      // If we are on a node call recursively the function, skipping approved list
      if (item != "approved") { findValuesMatchingRegex (mds[item], regex, arr); }
    } else if (regex.test(mds[item]) ) {
      if (! arr.includes(mds[item])) { arr.push(mds[item]); }
    }
  }
  return arr;
}
