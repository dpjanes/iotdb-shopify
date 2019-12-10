/*
 *  product/delete.js
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
const delete_ = _.promise((self, done) => {
    _.promise(self)
        .validate(delete_)

        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product_id}.json`
        })
        .then(fetch.delete)
        .then(fetch.go.json)
        .make(sd => {
            sd.product = sd.json && sd.json.product || null
        })

        .end(done, self, delete_)
})

delete_.method = "product.delete"
delete_.description = `Delete a Product`
delete_.requires = {
    shopify: _.is.Dictionary,
    product_id: _.is.Number,
}
delete_.produces = {
    product: _.is.JSON,
}
delete_.params = {
    product_id: _.p.normal,
}
delete_.p = _.p(delete_)

/**
 *  API
 */
exports.delete = delete_
