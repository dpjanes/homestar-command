/*
 */

const iotdb = require("iotdb")
iotdb.use("homestar-command")

const things = iotdb.connect("CommandOn", {
    uuid: "5F3BEF56-09DB-42E6-B8E7-98334A0A5DE1",
    command: () => {
        console.log("hello, world");
    },
})
things.on("thing", thing => {
    console.log("+", "thing", thing.thing_id());
    thing.set(":on.true", true);
})
things.on("istate", thing => {
    console.log("+", "istate", thing.thing_id(), thing.state("istate"));
})
