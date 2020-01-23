/*
 *  inventory_level/set.js
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
const set = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(set)

        .then(shopify.location.synthesize)
        .then(shopify.inventory_item.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/inventory_levels/set.json`
            sd.json = sd.inventory_level
        })
        .then(fetch.post)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .make(sd => {
            sd.inventory_level = sd.json && sd.json.inventory_level || null
        })

        .end(done, self, set)
})

set.method = "inventory_level.set"
set.description = `Connect a Inventory Level to a Location`
set.requires = {
    shopify: _.is.shopify,
    inventory_level: {
        inventory_item_id: _.is.Integer,
        location_id: _.is.Integer,
        available: _.is.Integer,
    },
}
set.accepts = {
    inventory_level: {
        disconnect_if_necessary: _.is.Boolean,
    },
}
set.produces = {
    inventory_level: _.is.shopify.inventory_level,
}
set.params = {
    inventory_level: _.p.normal,
}
set.p = _.p(set)

/**
 *  API
 */
exports.set = set
