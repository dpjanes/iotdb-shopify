/*
 *  inventory_item/patch.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-01-23
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
    const shopify = require("..")

    _.promise(self)
        .validate(patch)

        .then(shopify.inventory_item.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/inventory_items/${sd.inventory_item.id}.json`
            sd.json = {
                "inventory_item": sd.inventory_item,
            }
        })
        .then(fetch.put)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .except(_.error.otherwise(404, { json: null }))
        .make(sd => {
            sd.inventory_item = sd.json && sd.json.inventory_item || null
        })

        .end(done, self, patch)
})

patch.method = "inventory_item.patch"
patch.description = `Get the Inventory Item by ID`
patch.requires = {
    shopify: _.is.shopify,
    inventory_item: _.is.shopify.synthesize,
}
patch.produces = {
    inventory_item: _.is.shopify.inventory_item,
}
patch.params = {
    inventory_item: _.p.normal,
}
patch.p = _.p(patch)

/**
 */
const by_variant = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(by_variant)

        .add("variant/inventory_item_id:inventory_item")
        .then(shopify.inventory_item.patch)

        .end(done, self, by_variant)
})

by_variant.method = "inventory_item.by.variant"
by_variant.description = `Get the Inventory Item associated with a Variant`
by_variant.requires = {
    shopify: _.is.shopify,
    variant: _.is.shopify.variant,
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
exports.patch = patch
exports.patch.by_variant = by_variant
