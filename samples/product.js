/*
*  samples/product.js
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
const fs = require("iotdb-fs")
const shopify = require("..")

const minimist = require("minimist")

const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

if (action("product.list")) {
    _.promise({
        shopify$cfg: require("./shopify.json"),
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.list.p({}))
        .make(sd => {
            console.log("+", JSON.stringify(sd.products, null, 2))
            console.log("+", JSON.stringify(sd.cursor, null, 2))
        })
        .except(_.error.log)
} else if (action("product.list.all")) {
    _.promise({
        shopify$cfg: require("./shopify.json"),
        verbose: true,
    })
        .then(shopify.initialize)
        .page({
            batch: shopify.product.list.all,
            outputs: "products",
            output_selector: sd => sd.products,
        })
        .make(sd => {
            console.log("+", JSON.stringify(sd.products.length, null, 2))
        })
        .except(_.error.log)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}
