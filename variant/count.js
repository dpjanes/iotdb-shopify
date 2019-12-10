/*
 *  product/count.js
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
const links = require("iotdb-links")

const URL = require("url").URL

const logger = require("../logger")(__filename)
const _util = require("../lib/_util")

/**
 */
const count_product_id = _.promise((self, done) => {
    _.promise(self)
        .validate(count_product_id)

        .make(sd => {
            sd.count = 0
            sd.url = `${_util.api(sd)}/products/${sd.product_id}/variants/count.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .make(sd => {
            sd.count = sd.json.count
        })

        .end(done, self, count_product_id)
})

count_product_id.method = "variant.list.product_id"
count_product_id.requires = {
    shopify: _.is.Dictionary,
    product_id: _.is.Integer,
}
count_product_id.accepts = {
}
count_product_id.produces = {
    count: _.is.Integer,
}
count_product_id.params = {
    product_id: _.p.normal,
}
count_product_id.p = _.p(count_product_id)

/**
 *  API
 */
exports.count = {
    product_id: count_product_id,
}
