/*
 *  product/variant/count.js
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
const count = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(count)

        .then(shopify.product.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product.id}/variants/count.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, { json: null }))
        .make(sd => {
            sd.count = sd.json ? sd.json.count : 0
        })

        .end(done, self, count)
})

count.method = "variant.count"
count.description = `Count the Variants of a Product`
count.requires = {
    shopify: _.is.Dictionary,
    product: [ _.is.Integer, _.is.String, _.is.Dictionary, ],
}
count.accepts = {
}
count.produces = {
    count: _.is.Integer,
}
count.params = {
    product: _.p.normal,
}
count.p = _.p(count)

/**
 *  API
 */
exports.count = count
