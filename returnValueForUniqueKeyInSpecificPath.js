// description: Return value for key in MDS

/** This exporter takes as argument a full path and keyName and returns the value
 * Argument : path.keyName  : example : PRD1/infra/server03/IP
 */

var nodePathNotFound = false;
var found = false;
var value;
var keyNotFound=false;

function findValues (mds, pathSteps) {
    var subset = {};
    for (var i = 0; i < pathSteps.length; i++ ) {
        if ( i === 0) {
            if (metadataset.hasOwnProperty(pathSteps[0])) {
                subset = metadataset[pathSteps[0]];
            }
            else {
                nodePathNotFound = true;
                break;
            }
        }
        else if ( i === pathSteps.length -1) {

            if (subset.hasOwnProperty(pathSteps[i])) {
                value = subset[pathSteps[i]];
            }
            else {
                keyNotFound = true;
            }


        }
        else {
            if (subset.hasOwnProperty(pathSteps[i])) {
                subset = subset[pathSteps[i]];
            }
            else {
                nodePathNotFound = true;
                break;
            }
        }
    }
}


var path1Steps =  args[0].split('/');
findValues (metadataset, path1Steps);

if (nodePathNotFound === true) {
    return 'error: nodePath does not exist';
}
if (keyNotFound === true) {
    return 'error: keyName not found';
}
return value;
