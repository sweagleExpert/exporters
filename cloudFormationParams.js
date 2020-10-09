// description: Return all data for a given unique node name
// add return in gobus format


var subNode=args;
var subset = metadatasets[0];
var nodesWithSameName = 0;


function retrieveAllData(mds, searchTerm) {

    for (var item in mds) {
        if (typeof(mds[item]) === 'object') {
            if (searchTerm === item) {
                nodesWithSameName = nodesWithSameName + 1;

                subset = mds[item];
            }
            else {
                retrieveAllData(mds[item], searchTerm);
            }
        }
    }
}


if (subNode!=null) {
    retrieveAllData(metadatasets, subNode[0]);
}
else {
    return metadataset;
 
}


if (nodesWithSameName === 0) {
    return "ERROR: nodeName not found";
}
else if (nodesWithSameName === 1) {
    var pretext =  "[\n";
    var posttext = "\n]";
    var text="";
    for (var key in subset){
        if (typeof(subset[key]) !== 'object') {
            var text = text +
                "  {\n" +
                "     \"ParameterKey\":" + "\""+ key + "\",\n" +
                "     \"ParameterValue\":" + "\""+ subset[key] + "\"\n" +
                "  },\n";
        }
    }
    text = text.replace(/,\s*$/, "");  //remove last comma
    var returntext = pretext+text+posttext;
    return returntext;
}
else {
  return "ERROR: multiple nodeNames found";
 
}
