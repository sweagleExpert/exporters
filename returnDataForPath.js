// description: Return all data for a given path

// Exporter to return all data (= all MDI and all childNodes + their MDIs)
//
// provide as arguments all nodes that when combined provide the exact path for which
// all data needs to be retrieved.
// Each nodeName in the path must be provided as a separate argument value
// When no argument is provided then ALL data from the metadata set is returned

var subset = metadataset;

// we loop through all provided arguments (= nodeNames in the path) and check if the path exist
// when we get to the last argument we return whole metadataset at that last nodeName.

for (var i = 0; i < args.length; i++) {
    	// check if path is valid and if so store all data in subset
	if (subset.hasOwnProperty(args[i]) === true) {
		subset = subset[args[i]];
	}
	// if not valid return error message
	else {
		return "ERROR: path not found: " + args[i];
	}
// keep looping through the provided arguments.
// when last node is reached, subset contains the data we are looking for
}
return subset;
