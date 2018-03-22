# SWEAGLE 
### Introduction to the EXPORTER parserLogic

This capability allows to return a subset of the snapshot content based upon a configurable logic. That logic is basically a javascript snippet that is executed when another toolset requests the snapshot for a given metadata snapshot.
>*metadata set + arguments + logic = output*


![](https://s3-us-west-2.amazonaws.com/media.forumbee.com/i/dc7ff87f-2314-456e-b03c-796b483d3861/h/547.png)


## Input
**Metadata set**

The parser logic is applied on a metadata set. Currently this is limited to the current VALID snapshot of a given metadata set. In the future we will support the pending metadata set as well as any other snapshot version.

**Arguments**

When calling the parserLogic the requester can send additional arguments along. Those are available in the parserLogic as an array of arguments (variable "args").

> When entering an argument value, make sure to hit enter such that the argument value appears as a green text block. Otherwise the argument is not picked up by the editor. The values entered are for test purposes only and will not be used at run time.

**Logic**

The supported logic is javascript. The editor provides basic javaScript syntax checking.

The parser logic is applied on a metadata set which is stored as a JSON object. In order to be able to export/access our data from a child node we use recursion. We have a set of parent nodes, we want to access their direct child nodes, then loop over that extended set to find the next level of child nodes, until we find no child nodes any more. That’s exactly what recursion is all about, automatically discovering how many steps need to be done.

## Output

The output is the result of the logic and can be provided on JSON, YAML, XML and CSV (depending on the formatting during the logic).

It is best practice to apply proper error handling. The parserLogic execution will automatically stop long running javaScript processes (30 seconds).

## Draft & published

Every exporter parser logic has 2 "versions": a "draft / editing" version and a "published version".
+ Users can save a "work in progress" logic and return to it later. If there is a draft version, then this is automatically loaded when the user enters into the parser configuration screen.
+ Published version of the exporter parser logic. This is the logic that is applied on the snapshot of the metadata when it is requested through the API (not yet public available this moment).

There is no history of published parser logics. When a parser logic gets published, it "overwrites" the current published parser logic and any new requests are immediately executed with the new published parser logic.