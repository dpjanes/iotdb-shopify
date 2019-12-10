/*
 *  product/list.js
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
const list_product_id = _.promise((self, done) => {
    _.promise(self)
        .validate(list_product_id)

        .make(sd => {
            sd.variants = []
            sd.cursor = {}
            sd.url = `${_util.api(sd)}/products/${sd.product_id}/variants.json`

            if (sd.pager) {
                sd.url = _util.extend_with_query(sd.url, { [ page_info ]: sd.pager })
            }
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, sd => sd.json = { variants: [] }))
        .make(sd => {
            sd.variants = sd.json.variants

            const next = _.flatten(_.d.list(sd.headers, "link", [])
                .map(link => links.parse.flat(link)))
                .filter(linkd => linkd.rel === "next")
                .map(linkd => linkd.url)
                .find(url => url)
            if (next) {
                const url = new URL(next)
                const page_info = url.searchParams.get("page_info")
                if (_.is.String(page_info)) {
                    sd.cursor = {
                        next: page_info,
                        has_next: true,
                    }
                }
            }
        })

        .end(done, self, list_product_id)
})

list_product_id.method = "variant.list.product_id"
list_product_id.description = `List the variants of a Product (by product_id)`
list_product_id.requires = {
    shopify: _.is.Dictionary,
    product_id: _.is.Integer,
}
list_product_id.accepts = {
    pager: _.is.String,
}
list_product_id.produces = {
    variants: _.is.Array.of.Dictionary,
    cursor: _.is.Dictionary,
}
list_product_id.params = {
    product_id: _.p.normal,
}
list_product_id.p = _.p(list_product_id)

/**
 *  API
 */
exports.list = {
    product_id: list_product_id,
}
