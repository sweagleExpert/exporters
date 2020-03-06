// description: Return all data for one or multiple nodes names

function retrieveAllData(mds, args) {
	for ( var item in mds) {
		if (typeof (mds[item]) === 'object') {
			if (args === item) {
				subsets[i] = mds[item];
			} else {
				retrieveAllData(mds[item], args);
			}
		}
	}
}

var subsets = [];
for (var i = 0; i < args.length; i++) {
  retrieveAllData(metadataset, args[i]);
}
if (args.length > 1) {
	return subsets;
} else if (args.length == 1) {
	return subsets[0];
} else { return metadataset; }
