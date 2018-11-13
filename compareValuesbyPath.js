// description: Validates that keys exists under given path and have the given value

/** Validates that keys exists under given path and have the given value
 * Argument1 : path.keyName=value  : example : gbl20026724/aggregator/default.enable-frtb-rad=false
 * Argument2: path.keyname=value : example : gbl20026724/riskserver/default.enable-frtb-rad=false
 */

var values = [];
var found = false;

function findValues (mds, pathSteps) {
	var subset = {};
    for (var i = 0; i < pathSteps.length -1; i++ ) {
        if ( i === 0) {
            if (metadataset.hasOwnProperty(pathSteps[0])) {
                subset = metadataset[pathSteps[0]];
            }
            else {
                found = true;
                break;
            }
        }
        else if ( i === pathSteps.length -2) {
        	if (subset[pathSteps[i]] === pathSteps[i +1]) {
        		values.push(true);
        	}
        	else {
        		values.push(false);
        	}

        }
        else {
            if (subset.hasOwnProperty(pathSteps[i])) {
                subset = subset[pathSteps[i]];
            }
            else {
            	found = true;
            	break;
            }
        }
    }
}

for (var i=0; i<args.length; i++) {
	var temp1 = args[i].split('=');
	var path1Steps =  temp1[0].split('/');
	path1Steps.push(temp1[1]);
	findValues (metadataset, path1Steps);
}
if (found === true) {
	return 'Path is wrong!';
}

if (values.includes(false)) {
	return false;
}
else {
	return true;
}
