/*
 *  CommandOff.js
 *
 *  David Janes
 *  IOTDB
 *  2016-05-07
 */

var iotdb = require("iotdb");

exports.binding = {
    bridge: require('../CommandBridge').Bridge,
    model: require('./command-off.json'),
};
