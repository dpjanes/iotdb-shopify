/*
 *  product/image/create.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-01-20
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

const path = require("path")

/**
 */
const create = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(create)

        .then(shopify.product.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product.id}/images.json`

            sd.json = {
                image: sd.image,
            }
        })
        .then(fetch.post)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .make(sd => {
            sd.image = sd.json && sd.json.image || null
        })

        .end(done, self, create)
})

create.method = "image.create"
create.description = `Create a new Image`
create.requires = {
    shopify: _.is.shopify,
    product: _.is.shopify.synthesize,
    image: _.is.shopify.data,
}
create.accepts = {
    image: {
        attachment: _.is.String,
        url: _.is.AbsoluteURL,
        position: _.is.Integer,
        filename: _.is.String,
    },
}
create.produces = {
    image: _.is.shopify.image,
}
create.params = {
    product: _.p.normal,
    image: _.p.normal,
}
create.p = _.p(create)

/**
 */
const create_document = _.promise((self, done) => {
    const shopify = require("..")

    _.promise(self)
        .validate(create_document)

        .then(shopify.product.synthesize)
        .make(sd => {
            sd.url = `${_util.api(sd)}/products/${sd.product.id}/images.json`

            sd.json = {
                image: {
                    attachment: sd.document.toString("base64"),
                },
            }

            if (sd.document_name) {
                sd.json.image.filename = path.basename(sd.document_name)
            }
        })
        .then(fetch.post)
        .then(fetch.body.json)
        .then(fetch.go.json)
        .make(sd => {
            sd.image = sd.json && sd.json.image || null
        })

        .end(done, self, create_document)
})

create_document.method = "product.image.create_document"
create_document.description = `Create a new Image from self.document`
create_document.requires = {
    shopify: _.is.shopify,
    product: _.is.shopify.synthesize,

    document: _.is.Buffer,
    document_media_type: x => _.is.String(x) && x.startsWith("image/"),
}
create_document.accepts = {
    document_name: _.is.String,
}
create_document.produces = {
    image: _.is.JSON,
}

/**
 *  API
 */
exports.create = create
exports.create.document = create_document
