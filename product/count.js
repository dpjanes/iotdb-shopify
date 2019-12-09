/*
 *  product/count.js
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
const links = require("iotdb-links")

const URL = require("url").URL

const logger = require("../logger")(__filename)
const _util = require("./_util")

/**
 */
const count = _.promise((self, done) => {
    _.promise(self)
        .validate(count)

        .make(sd => {
            sd.count = 0
            sd.url = `${_util.api(sd)}/products/count.json`

            if (sd.query) {
                sd.url = _util.extend_with_query(sd.url, sd.query)
            }
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .make(sd => {
            sd.count = sd.json.count
        })

        .end(done, self, count)
})

count.method = "product.count"
count.requires = {
    shopify: _.is.Dictionary,
}
count.accepts = {
    query: _.is.Dictionary,
}
count.produces = {
    count: _.is.Integer,
}
count.params = {
    query: _.p.normal,
}
count.p = _.p(count)

/**
 */
const all = _.promise((self, done) => {
    _.promise(self)
        .validate(all)
        
        .then(count.p({}))

        .end(done, self, all)
})

all.method = "product.count.all"
all.description = `List everything`
all.requires = {
}
all.produces = {
    count: _.is.Integer,
}

/**
 *  API
 */
exports.count = count
exports.count.all = all
