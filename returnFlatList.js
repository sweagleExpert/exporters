// description: Return all data in flat list format

var returnedObject = {};
var mdsName = Object.keys(metadataset);
if ( mdsName.length > 0 && metadataset.hasOwnProperty(mdsName[0]) && metadataset[mdsName[0]].hasOwnProperty(mdsName[0])) {

    checkNestedObject( metadataset[mdsName[0]][ mdsName[0] ] , returnedObject );

}

var includedKeys = Object.keys(metadataset[mdsName[0]]);

for (var i = 0;i<includedKeys.length; i++) {
    if (includedKeys[i] !== mdsName[0]) {
        returnedObject[includedKeys[i]] = metadataset[mdsName[0]][includedKeys[i]];
    }
}

return returnedObject;


function checkNestedObject ( nestedObject , returnedObject ) {
    var objKeys = Object.keys(nestedObject);

    for (var i = 0; i < objKeys.length; i++ ) {
        if (typeof nestedObject [ objKeys[i] ] === 'object') {
            checkNestedObject ( nestedObject [ objKeys[i] ] , returnedObject  );
        }else {
            returnedObject[ objKeys[i] ] = nestedObject [ objKeys[i] ] ;
        }
    }
}
