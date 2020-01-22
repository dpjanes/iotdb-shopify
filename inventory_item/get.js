/*
 *  inventory_item/get.js
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
const get = _.promise((self, done) => {
    _.promise(self)
        .validate(get)

        .make(sd => {
            sd.url = `${_util.api(sd)}/inventory_items/${sd.inventory_item_id}.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, { json: null }))
        .make(sd => {
            sd.inventory_item = sd.json && sd.json.inventory_item || null
        })

        .end(done, self, get)
})

get.method = "inventory_item.get"
get.description = `Get the Inventory Item by blain@pqbtourism.com`
get.requires = {
    shopify: _.is.shopify,
    inventory_item_id: _.is.Integer,
}
get.produces = {
    inventory_item: _.is.JSON,
}
get.params = {
    inventory_item_id: _.p.normal,
}
get.p = _.p(get)

/**
 */
const by_variant = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(by_variant)

        .conditional(sd => _.is.Atomic(sd.variant), shopify.variant.get.p(self.variant))
        .make(sd => {
            sd.url = `${_util.api(sd)}/inventory_items/${sd.variant.inventory_item_id}.json`
        })
        .then(fetch.get)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, { json: null }))
        .make(sd => {
            sd.inventory_item = sd.json && sd.json.inventory_item || null
        })

        .end(done, self, by_variant)
})

by_variant.method = "inventory_item.by.variant"
by_variant.description = `Get the Inventory Item associated with a Variant`
by_variant.requires = {
    shopify: _.is.shopify,
    variant: _.is.shopify.synthesize,
}
by_variant.produces = {
    inventory_item: _.is.JSON,
}
by_variant.params = {
    variant: _.p.normal,
}
by_variant.p = _.p(by_variant)

/**
 *  API
 */
exports.get = get
exports.by = {
    id: get,
    variant: by_variant,
}
