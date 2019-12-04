/*
 *  products/list.js
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

const logger = require("../logger")(__filename)

/**
 */
const list = _.promise((self, done) => {
    _.promise(self)
        .validate(list)
        .make(sd => {
            sd.products = []
            sd.cursor = null
            sd.url = `https:${sd.shopify.cfg.api_key}:${sd.shopify.cfg.password}@${sd.shopify.cfg.host}/admin/api/2019-10/products.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .make(sd => {
            sd.products = sd.json.products

            const next = _.flatten(_.d.list(sd.headers, "link", [])
                .map(link => links.parse.flat(link)))
                .filter(linkd => linkd.rel === "next")
                .map(linkd => linkd.url)
                .find(url => url)
            if (next) {
                sd.cursor = {
                    next: next,
                    has_next: true,
                }
            }
        })

        .end(done, self, list)
})

list.method = "products.list"
list.requires = {
    shopify: _.is.Dictionary,
    query: _.is.Dictionary,
}
list.accepts = {
}
list.produces = {
    products: _.is.Array.of.Dictionary,
    cursor: _.is.Dictionary,
}
list.params = {
    query: _.p.normal,
}
list.p = _.p(list)


/**
 *  API
 */
exports.list = list
