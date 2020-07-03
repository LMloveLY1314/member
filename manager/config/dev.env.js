// 'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8082/"' //
  // BASE_API: '"http://47.97.105.123:8080/"' //外网
})
