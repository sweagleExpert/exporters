// Alternative CSV Exporter
// Iterates over a config set and sub nodes
// creates a csv file where the first set of columns are
// the nodes and the last 2 columns are the CDI key and value
// use PROPS as export type

const iterate = (obj) => {
    
    Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
		nodes[i]=key;
      	i++;
    	iterate(obj[key]);
        i--;
        }
      else {
        text = text + nodes.join();
        text = text  +"," + key+","+obj[key]+"\n";
      }
    })
}
var i=0;	
var nodes=[];
var text="";
iterate(metadataset);
return text;
