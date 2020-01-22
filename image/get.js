/*
 *  product/image/get.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-01-20
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
const get = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(get)

        .then(shopify.product.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product.id}/images/${sd.image_id}.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, { json: null }))
        .make(sd => {
            sd.image = sd.json && sd.json.image || null
        })

        .end(done, self, get)
})

get.method = "image.get"
get.description = `Get Image`
get.requires = {
    shopify: _.is.Dictionary,
    product: _.is.Integer,
    image_id: _.is.Integer,
}
get.produces = {
    image: _.is.JSON,
}
get.params = {
    product: _.p.normal,
    image_id: _.p.normal,
}
get.p = _.p(get)

/**
 *  API
 */
exports.get = get
