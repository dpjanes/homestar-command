/*
 *  CommandBridge.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-05-07
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const child_process = require('child_process');

const logger = iotdb.logger({
    name: 'homestar-command',
    module: 'CommandBridge',
});

/**
 *  See {iotdb.bridge.Bridge#Bridge} for documentation.
 *  <p>
 *  @param {object|undefined} native
 *  only used for instances, should be 
 */
const CommandBridge = function (initd, native) {
    const self = this;

    self.initd = _.defaults(initd,
        iotdb.keystore().get("bridges/CommandBridge/initd"), {
            name: null,
            uuid: null,
        }
    );
    self.native = native;   // the thing that does the work - keep this name

    if (self.native) {
        if (!self.initd.uuid) {
            logger.error({
                method: "CommandBridge",
                initd: self.initd,
                cause: "caller should initialize with an 'uuid', used to uniquely identify things over sessions",
            }, "missing initd.uuid - problematic");
        }
    }
};

CommandBridge.prototype = new iotdb.Bridge();

/* --- lifecycle --- */

/**
 *  See {iotdb.bridge.Bridge#discover} for documentation.
 */
CommandBridge.prototype.discover = function () {
    const self = this;

    logger.info({
        method: "discover"
    }, "called");

    self.discovered(new CommandBridge(self.initd, {}));
};

/**
 *  See {iotdb.bridge.Bridge#connect} for documentation.
 */
CommandBridge.prototype.connect = function (connectd) {
    const self = this;
    if (!self.native) {
        return;
    }

    self._validate_connect(connectd);
};

CommandBridge.prototype._forget = function () {
    const self = this;
    if (!self.native) {
        return;
    }

    logger.info({
        method: "_forget"
    }, "called");

    self.native = null;
    self.pulled();
};

/**
 *  See {iotdb.bridge.Bridge#disconnect} for documentation.
 */
CommandBridge.prototype.disconnect = function () {
    const self = this;
    if (!self.native || !self.native) {
        return;
    }

    self._forget();
};

/* --- data --- */

/**
 *  See {iotdb.bridge.Bridge#push} for documentation.
 */
CommandBridge.prototype.push = function (pushd, done) {
    const self = this;
    if (!self.native) {
        done(new Error("not connected"));
        return;
    }

    self._validate_push(pushd, done);

    logger.warn({
        method: "push",
        pushd: pushd
    }, "push");

    if (self.initd.command) {
        self.initd.command(pushd);
    } else if (self.initd.shell) {
        child_process.exec(self.initd.shell, (error, stdout, stderr) => {
            console.log(stdout);
        });
    }

    // see what we did here?
    self.pulled(pushd);
    done();
};

/**
 *  See {iotdb.bridge.Bridge#pull} for documentation.
 */
CommandBridge.prototype.pull = function () {
    const self = this;
    if (!self.native) {
        return;
    }
};

/* --- state --- */

/**
 *  See {iotdb.bridge.Bridge#meta} for documentation.
 */
CommandBridge.prototype.meta = function () {
    const self = this;
    if (!self.native) {
        return;
    }

    return {
        "iot:thing-id": _.id.thing_urn.unique("Command", self.initd.uuid),
        "schema:name": self.native.name || "Command",

        // "iot:thing-number": self.initd.number,
        // "iot:device-id": _.id.thing_urn.unique("Command", self.initd.uuid),
        // "schema:manufacturer": "",
        // "schema:model": "",
    };
};

/**
 *  See {iotdb.bridge.Bridge#reachable} for documentation.
 */
CommandBridge.prototype.reachable = function () {
    return this.native !== null;
};

/**
 *  See {iotdb.bridge.Bridge#configure} for documentation.
 */
CommandBridge.prototype.configure = function (app) {};

/*
 *  API
 */
exports.Bridge = CommandBridge;
