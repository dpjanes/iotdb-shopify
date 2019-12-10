/*
 *  variant/create.js
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

const logger = require("../logger")(__filename)
const _util = require("../lib/_util")

/**
 */
const create = _.promise((self, done) => {
    _.promise(self)
        .validate(create)

        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product_id}/variants.json`

            sd.json = {
                variant: sd.variant,
            }
        })
        .then(fetch.post)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .make(sd => {
            sd.variant = sd.json && sd.json.variant || null
        })

        .end(done, self, create)
})

create.method = "variant.create"
create.description = `Create a new Variant`
create.requires = {
    shopify: _.is.Dictionary,
    product_id: _.is.Integer,
    variant: {
        option1: _.is.String,
    },
}
create.accepts = {
    variant: _.is.JSON,
}
create.produces = {
    variant: _.is.JSON,
}
create.params = {
    product_id: _.is.Integer,
    variant: _.p.normal,
}
create.p = _.p(create)

/**
 *  API
 */
exports.create = create
