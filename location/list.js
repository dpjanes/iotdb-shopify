/*
 *  location/list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-12-04
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
const list = _.promise((self, done) => {
    _.promise(self)
        .validate(list)

        .make(sd => {
            sd.url = `${_util.api(sd)}/locations.json`

            if (sd.pager) {
                sd.url = _util.extend_with_query(sd.url, { [ page_info ]: sd.pager })
            }
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .add("json/locations")
        .then(_util.build_cursor)

        .end(done, self, list)
})

list.method = "location.list"
list.requires = {
    shopify: _.is.shopify,
}
list.accepts = {
    pager: _.is.String,
}
list.produces = {
    locations: _.is.Array.of.Dictionary,
    cursor: _.is.Dictionary,
}

/**
 *  API
 */
exports.list = list
