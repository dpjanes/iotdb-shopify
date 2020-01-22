/*
 *  product/image/patch.js
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
const patch = _.promise((self, done) => {
    _.promise(self)
        .validate(patch)

        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.image.product_id}/images/${sd.image.id}.json`

            sd.json = {
                image: sd.image,
            }
        })
        .then(fetch.put)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .make(sd => {
            sd.image = sd.json && sd.json.image || null
        })

        .end(done, self, patch)
})

patch.method = "product.image.patch"
patch.description = `Patch Image`
patch.requires = {
    shopify: _.is.Dictionary,
    image: {
        product_id: _.is.Integer,
        id: _.is.Integer,
    },
}
patch.accepts = {
    image: _.is.JSON,
}
patch.produces = {
    image: _.is.JSON,
}
patch.params = {
    image: _.p.normal,
}
patch.p = _.p(patch)

/**
 *  API
 */
exports.patch = patch
