/*
 *  product/synthesize.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-12-10
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
const synthesize = _.promise(self => {
    _.promise.validate(self,synthesize)

    self.product = {
        id: sd.product_id,
    }
})

synthesize.method = "product.synthesize"
synthesize.description = `Create a Product from product_id`
synthesize.requires = {
    shopify: _.is.Dictionary,
    product_id: _.is.Number,
}
synthesize.accepts = {
}
synthesize.produces = {
    product: _.is.JSON,
}
synthesize.params = {
    product_id: _.p.normal,
}
synthesize.p = _.p(synthesize)

/**
 *  API
 */
exports.synthesize = synthesize
