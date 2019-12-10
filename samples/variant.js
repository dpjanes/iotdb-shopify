/*
*  samples/variant.js
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
const fs = require("iotdb-fs")
const shopify = require("..")

const minimist = require("minimist")

const shopifyd = require("./cfg/shopify.json")

const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

const PRODUCT_ID = 4378702610571
const VARIANT_ID = 31438769553547

if (action("variant.list")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.variant.list.product_id.p(ad.id || PRODUCT_ID))
        .make(sd => {
            console.log("+", JSON.stringify(sd.variants, null, 2))
            console.log("+", JSON.stringify(sd.cursor, null, 2))
        })
        .except(_.error.log)
} else if (action("variant.count")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.variant.count.product_id.p(ad.id || PRODUCT_ID))
        .make(sd => {
            console.log("+", JSON.stringify(sd.count, null, 2))
        })
        .except(_.error.log)
} else if (action("variant.get")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.variant.get.p(ad.id || VARIANT_ID))
        .make(sd => {
            console.log("+", JSON.stringify(sd.variant, null, 2))
        })
        .except(_.error.log)
} else if (action("variant.patch")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.variant.get.p(ad.id || VARIANT_ID))
        .make(sd => {
            console.log("+", "old", sd.variant.title)
            const match = sd.variant.title.match(/^(.*) - (\d+)$/)
            if (!match) {
                sd.variant.title = `${sd.variant.title} - 1`
            } else {
                sd.variant.title = `${match[1]} - ${parseInt(match[2]) + 1}`
            }

            // INVESTING - cannot change the variant name

            sd.variant = {
                id: sd.variant.id,
                title: sd.variant.title,
                price: "1.01",
            }
        })
        .then(shopify.variant.patch)
        .make(sd => {
            console.log("+", "new", sd.variant.title)
        })
        .except(_.error.log)
} else if (!action_name) {
    console.log("#", "action required")
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}
