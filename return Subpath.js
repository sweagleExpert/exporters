var subset = metadataset;

// we loop through the parts of the path to get to the desire subpart
// if we and up with a wrong path we return the whole metadaset
for (var i = 0; i < args.length; i++) {
    // check if path is valid
	if (subset.hasOwnProperty(args[i]) === true) {
		subset = subset[args[i]];
	}
	// if not valid return everything
	else {
		return "ERROR: path not found";
	}
}
return subset;