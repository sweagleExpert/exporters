// description: Compare two paths to check if they have same keys

//provide 2 full path node names as arguments
//example MaRS2Workshop/PTE/gbl20026723/aggregator
//

if (args.length !== 2) {
    return 'Please enter two paths!';
}

var path1Steps = args[0].split('/');
var path2Steps = args[1].split('/');

var firstNode = findNodeByPath( path1Steps , metadataset );
var secondNode = findNodeByPath( path2Steps , metadataset );

if (firstNode.outcome === true && secondNode.outcome === true) {

    var firstNodeKeys = Object.keys(firstNode.data);
    var secondNodeKeys = Object.keys(secondNode.data);
    var diffs = [];
    for ( var i = 0 ; i < firstNodeKeys.length ; i++ ) {
        if (secondNodeKeys.includes(firstNodeKeys[i]) === false) {
            diffs.push(firstNodeKeys[i] );
        }
    }
    for ( var i = 0 ; i < secondNodeKeys.length ; i++ ) {
        if (firstNodeKeys.includes(secondNodeKeys[i]) === false) {
            diffs.push(secondNodeKeys[i] );
        }
    }
    if (diffs.length === 0) {
        return 'No Difference';
    }
    else {
        return diffs;
    }

}
else if (firstNode.outcome === true && secondNode.outcome === false) {
    return 'Path of Node 2 is wrong!';
}
else if (firstNode.outcome === false && secondNode.outcome === true) {
    return 'Path of Node 1 is wrong!';
}
else if (firstNode.outcome === false && secondNode.outcome === false) {
    return 'Paths of both Nodes are wrong!';
}

function findNodeByPath( pathSteps , metadataset ) {

    var subset = {};
    var found1 = true;
    for (var i = 0; i < pathSteps.length; i++ ) {
        if ( i === 0) {
            if (metadataset.hasOwnProperty(pathSteps[0])) {
                subset = metadataset[pathSteps[0]];
            }
            else {
                found1 = false;
                break;
            }
        }
        else {
            if (subset.hasOwnProperty(pathSteps[i])) {
                subset = subset[pathSteps[i]];
            }
            else {
                found1 = false;
                break;
            }
        }
    }

    if (found1 === false) {
        return { outcome : false };
    }
    else {
        return { outcome : true , data : subset };
    }
}
