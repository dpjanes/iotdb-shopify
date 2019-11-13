/*
 *  lib/initialize.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-11-13
 *
 *  Copyright (2013-2019-11-13
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

"use strict"

const _ = require("iotdb-helpers")

const logger = require("../logger")(__filename)

/**
 *  Requires: self.shopifyd
 *  Produces: self.shopify
 */
const initialize = _.promise((self, done) => {
    _.promise.validate(self, initialize)

    logger.trace({
        method: initialize.method,
    }, "called")

    shopify.createConnection(self.shopifyd, (error, client) => {
        if (error) {
            return done(error)
        }

        self.shopify = client;

        done(null, self)
    })
})

initialize.method = "initialize"
initialize.requires = {
    shopifyd: _.is.Dictionary,
}

/**
 *  API
 */
exports.initialize = initialize
