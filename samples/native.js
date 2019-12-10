/*
 *  samples/native.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-11-13
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
const fetch = require("iotdb-fetch")
const links = require("iotdb-links")

const minimist = require("minimist")

const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const shopifyd = require("./cfg/shopify.json")

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

if (action("products.list")) {
    _.promise({
        url: `https://${shopifyd.api_key}:${shopifyd.password}@${shopifyd.host}/admin/api/2019-10/products.json`,
        query: null,
    })
        .then(fetch.get)
        .then(fetch.go.json)
        .make(sd => {
            console.log("+", JSON.stringify(sd.json, null, 2))

            _.flatten(_.d.list(sd.headers, "link", [])
                .map(link => links.parse.flat(link)))
                .filter(linkd => linkd.rel === "next")
                .map(linkd => linkd.url)
                .forEach(linkd => {
                    console.log("+", "next", linkd)
                })
        })
        .except(_.error.log)
        
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}
