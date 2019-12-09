/*
 *  product/get.js
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
const get = _.promise((self, done) => {
    _.promise(self)
        .validate(get)

        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product_id}.json`

            if (sd.query) {
                sd.url = _util.extend_with_query(sd.url, sd.query)
            }
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .make(sd => {
            sd.product = sd.json && sd.json.product || null
        })

        .end(done, self, get)
})

get.method = "product.get"
get.description = `Get a Product`
get.requires = {
    shopify: _.is.Dictionary,
    product_id: _.is.Number,
}
get.produces = {
    product: _.is.JSON,
}
get.params = {
    product_id: _.p.normal,
}
get.p = _.p(get)

/**
 *  API
 */
exports.get = get
