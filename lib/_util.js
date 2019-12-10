/*
 *  product/_util.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-12-09
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

const URL = require("url").URL

const logger = require("../logger")(__filename)

/**
 */
const api = self => 
    `https://${self.shopify.cfg.api_key}:${self.shopify.cfg.password}@${self.shopify.cfg.host}/admin/api/2019-10`

/**
 */
const extend_with_query = (url, query) => {
    if (_.is.Dictionary(query)) {
        let join = url.indexOf("?") > -1 ? "&" : "?"

        _.mapObject(query, (value, key) => {
            url = `${url}${join}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            join = "?"
        })
    }

    return url
}

/**
 */
const build_cursor = _.promise(self => {
    _.promise.validate(self, build_cursor)

    self.cursor = null

    const next = _.flatten(_.d.list(self.headers, "link", [])
        .map(link => links.parse.flat(link)))
        .filter(linkd => linkd.rel === "next")
        .map(linkd => linkd.url)
        .find(url => url)
    if (!next) {
        return
    }

    const url = new URL(next)
    const page_info = url.searchParams.get("page_info")
    if (_.is.String(page_info)) {
        self.cursor = {
            next: page_info,
            has_next: true,
        }
    }
})

build_cursor.method = "_util.build_cursor"
build_cursor.description = ``
build_cursor.accepts = {
    headers: _.is.Dictionary,
}
build_cursor.produces = {
    cursor: _.is.Dictionary,
}

/**
 */
const synthesize = key => _.promise(self => {
    if (_.is.String(self[key])) {
        self[key] = {
            [ `${key}_id` ]: _.coerce.to.Integer(self[key]),
        }
    } else if (_.is.Integer(self[key])) {
        self[key] = {
            [ `${key}_id` ]: self[key],
        }
    }

    console.log("HERE:S", key, self)
})

synthesize.method = "_util.synthesize"

/**
 *  API
 */
exports.api = api
exports.extend_with_query = extend_with_query
exports.build_cursor = build_cursor
exports.synthesize = synthesize
