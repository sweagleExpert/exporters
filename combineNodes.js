// You can enter your own code here to manipulate the selected Metadataset.
// You can access the Metadataset's data through the variable `metadataset`.
// You can access your own Variables through the variable `args`.
// For example, try : ` return metadataset;`
// Or, try : ` return args;`

// You can enter your own code here to manipulate the selected Metadataset.
// You can access the Metadataset's data through the variable `metadataset`.
// You can access your own Variables through the variable `args`.
// For example, try : ` return metadataset;`
// Or, try : ` return args;`

function retrieveAllData(mds, args, subset) {

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

var combine = function () {

	var combined = {};
	
	var i = 0;


	//  combine the objects
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if ( Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					combined[prop] = combine(combined[prop], obj[prop]);
				} else {
					combined[prop] = obj[prop];
				}
			}
		}
	};

	//merge each object in loop
	for (; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return combined;

};


var subsets = new Array();
var combinedSubset = new Object;
if (args.length > 1) {
	for (var i = 0; i < args.length; i++) {
		retrieveAllData(metadataset, args[i], subsets[i]);
	}
} else {
	console.log("ERROR: requires at least 2 arguements to comnbine nodes");
}

for (var i = 0; i < subsets.length; i++) {

	combinedSubset = combine(combinedSubset, subsets[i]);
}
return combinedSubset;
