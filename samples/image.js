/*
*  samples/image.js
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
const IMAGE_ID = 13609720250507

if (action("image.list")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.synthesize.p(ad.id || PRODUCT_ID)) // you could also get
        .then(shopify.image.list)
        .make(sd => {
            console.log("+", JSON.stringify(sd.images, null, 2))
            console.log("+", JSON.stringify(sd.cursor, null, 2))
        })
        .except(_.error.log)
} else if (action("image.count")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.synthesize.p(ad.id || PRODUCT_ID)) // you could also get
        .then(shopify.image.count)
        .make(sd => {
            console.log("+", JSON.stringify(sd.count, null, 2))
        })
        .except(_.error.log)
} else if (action("image.get")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.image.get.p(PRODUCT_ID, IMAGE_ID))
        .make(sd => {
            console.log("+", JSON.stringify(sd.image, null, 2))
        })
        .except(_.error.log)
} else if (action("image.patch")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.image.get.p(ad.id || IMAGE_ID))
        .make(sd => {
            console.log("+", "old", sd.image.option1)

            const match = sd.image.option1.match(/^(.*) - (\d+)$/)
            if (!match) {
                sd.image.option1 = `${sd.image.option1} - 1`
            } else {
                sd.image.option1 = `${match[1]} - ${parseInt(match[2]) + 1}`
            }

            sd.image = {
                id: sd.image.id,
                option1: sd.image.option1,
            }
        })
        .then(shopify.image.patch)
        .make(sd => {
            console.log("+", "new", sd.image.title)
        })
        .except(_.error.log)
} else if (action("image.create")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.synthesize.p(ad.id || PRODUCT_ID)) // you could also get
        .then(shopify.image.create.p(null, {
            option1: "New Variant " + _.timestamp.make(),
        }))
        .make(sd => {
            console.log("+", sd.image)
        })
        .except(_.error.log)
} else if (action("image.delete")) {
    _.promise({
        shopify$cfg: shopifyd,
        verbose: true,
    })
        .then(shopify.initialize)
        .then(shopify.product.synthesize.p(ad.id || PRODUCT_ID))

        .then(shopify.image.create.p(null, {
            option1: "Delete Variant " + _.timestamp.make(),
        }))
        .make(sd => {
            console.log("+", "created", sd.image)
            sd.aside = sd.image.id
        })
        .log("deleting")
        .then(shopify.image.delete)
        .log("get")
        .add("aside:image_id")
        .then(shopify.image.get)

        .make(sd => {
            console.log("+", "after-delete", sd.image)
        })
        .except(_.error.log)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

