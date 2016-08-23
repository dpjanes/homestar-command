# homestar-command
[IOTDB](https://github.com/dpjanes/node-iotdb) Bridge to Run Commands

# About

This will run code or shell commands. 
At this point, we're only doing output but we may
modify so you can run commands and get the output

# Installation

* [Read this first](https://github.com/dpjanes/node-iotdb/blob/master/docs/install.md)

Then:

    $ npm install homestar-command

# Use
    
    const iotdb = require("iotdb")
    iotdb.use("homestar-command")

## Shell Command

    const things = iotdb.connect("CommandOn", {
        uuid: "5F3BEF56-09DB-42E6-B8E7-98334A0A5DE1",
        shell: "ls -l",
    })
    thing.set(":on.true", true);

## Node JS Command

    const things = iotdb.connect("CommandOn", {
        uuid: "5F3BEF56-09DB-42E6-B8E7-98334A0A5DE1",
        command: () => {
            console.log("hello, world");
        },
    })
    thing.set(":on.true");

