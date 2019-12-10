/*
 *  location/count.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-12-09
 *
 *  Copyright (2013-2020) David P. Janes
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
const fetch = require("iotdb-fetch")

const logger = require("../logger")(__filename)
const _util = require("../lib/_util")

/**
 */
const count = _.promise((self, done) => {
    _.promise(self)
        .validate(count)

        .make(sd => {
            sd.url = `${_util.api(sd)}/locations/count.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .make(sd => {
            sd.count = sd.json.count
        })

        .end(done, self, count)
})

count.method = "location.count"
count.description = `Count Locations`
count.requires = {
    shopify: _.is.Dictionary,
}
count.accepts = {
}
count.produces = {
    count: _.is.Integer,
}

/**
 *  API
 */
exports.count = count