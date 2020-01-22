/*
 *  inventory_level/connect.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-01-21
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
const connect = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(connect)

        .then(shopify.product.synthesize)
        .then(shopify.inventory_item.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/inventory_levels.json`

            sd.json = {
                inventory_item_id: sd.inventory_item_id.id,
                location_id: sd.location.id,
            }
        })
        .then(fetch.post)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .make(sd => {
            sd.inventory_level = sd.json && sd.json.inventory_level || null
        })

        .end(done, self, connect)
})

connect.method = "inventory_level.connect"
connect.description = `Connect a Inventory Level to a Location`
connect.requires = {
    shopify: _.is.shopify,
    inventory_item: [ _.is.Integer, _.is.String, _.is.Dictionary, ], 
    location: [ _.is.Integer, _.is.String, _.is.Dictionary, ], 
}
connect.accepts = {
}
connect.produces = {
    inventory_level: _.is.JSON,
}
connect.params = {
    location: _.p.normal,
    inventory_item: _.p.normal,
}
connect.p = _.p(connect)

/**
 *  API
 */
exports.connect = connect
