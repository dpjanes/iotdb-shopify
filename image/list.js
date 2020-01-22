/*
 *  product/image/list.js
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
const list = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(list)

        .then(shopify.product.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product.id}/images.json`

            if (sd.pager) {
                sd.url = _util.extend_with_query(sd.url, { [ page_info ]: sd.pager })
            }
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, { images: [] }))
        .add("json/images")
        .then(_util.build_cursor)

        .end(done, self, list)
})

list.method = "image.list"
list.description = `List the Images of a Product`
list.requires = {
    shopify: _.is.shopify,
    product: _.is.shopify.synthesize,
}
list.accepts = {
    pager: _.is.String,
}
list.produces = {
    images: _.is.Array.of.Dictionary,
    cursor: _.is.Dictionary,
}
list.params = {
    product: _.p.normal,
}
list.p = _.p(list)

/**
 *  API
 */
exports.list = list
