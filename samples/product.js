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

const shopifyd = require("./cfg/shopify.json")

const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

if (action("product.list")) {
    _.promise({
        shopify$cfg: shopifyd,
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
        shopify$cfg: shopifyd,
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
} else if (action("product.count")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.count)
        .make(sd => {
            console.log("+", sd.count)
        })
        .except(_.error.log)
} else if (action("product.get")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.get.p(4378702610571))
        .make(sd => {
            console.log("+", sd.product)
        })
        .except(_.error.log)
} else if (action("product.patch")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.get.p(4378702610571))
        .make(sd => {
            console.log("+", "old", sd.product.title)
            const match = sd.product.title.match(/^(.*) - (\d+)$/)
            if (!match) {
                sd.product.title = `${sd.product.title} - 1`
            } else {
                sd.product.title = `${match[1]} - ${parseInt(match[2]) + 1}`
            }

            sd.product = {
                id: sd.product.id,
                title: sd.product.title,
            }
        })
        .then(shopify.product.patch)
        .make(sd => {
            console.log("+", "new", sd.product.title)
        })
        .except(_.error.log)
} else if (action("product.create")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.create.p({
            title: "New Product " + _.timestamp.make(),
        }))
        .make(sd => {
            console.log("+", sd.product)
        })
        .except(_.error.log)
} else if (action("product.delete")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.create.p({
            title: "Delete Product " + _.timestamp.make(),
        }))
        .make(sd => {
            console.log("+", "created", sd.product)
            sd.aside = sd.product.id
        })
        .log("deleting")
        .then(shopify.product.delete)

        .log("get")
        .add("aside:product_id")
        .then(shopify.product.get)
        .make(sd => {
            console.log("+", "after-delete", sd.product)
        })
        .except(_.error.log)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}
