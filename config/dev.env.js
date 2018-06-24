'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // REQ_URL : '"http://172.17.4.236:8081"'
  REQ_URL : '"http://localhost:8081"'
})
