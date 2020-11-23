// description: Return all data for a given unique node name
// add generate simeple object
var subNode=JSON.parse(arg);
var subset = metadatasets[0];
var nodesWithSameName = 0;
var text ="";
var parent=null;

function retrieveAllDataFromNode(mds, searchTerm) {

    for (var item in mds) {
        if (typeof(mds[item]) === 'object') if (searchTerm === item) {
            nodesWithSameName = nodesWithSameName + 1;

            subset = mds[item];
        } else {
            retrieveAllDataFromNode(mds[item], searchTerm);
        }
    }
}

function iterate(obj, stack) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                parent=property;
                iterate(obj[property], stack + '.' + property);
            } else {
                if (parent !== null) {
                    text = text +
                        "\"" + parent + "." + property + "\": \"" + obj[property] + "\",\n";
                }
                else{
                    text = text +
                        "\"" + property + "\": \"" + obj[property] + "\",\n";
                }
            }
        }
    }

    return text;
}

if (subNode!=null) {
    retrieveAllDataFromNode(metadatasets, subNode[0]);
}
else {
    return metadataset;
    //console.log(metadatasets);
}


if (nodesWithSameName === 0) {
    return "ERROR: nodeName not found";
}
else if (nodesWithSameName === 1) {
    var pretext =  "{\n";
    var posttext = "\n}";
    var text="";
    text=iterate(subset, '');
    text = text.replace(/,\s*$/, "");  //remove last comma
    var returntext = pretext+text+posttext;
    var returnobj = JSON.parse(returntext);
    return returnobj;
//    console.log(returnobj);
}
else {
     return "ERROR: multiple blueprints found with named:"+ subNode;
 //   console.log("ERROR: multiple blueprints found with named:"+ subNode);
}


