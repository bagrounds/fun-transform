/**
 *
 * @module fun-transform
 */
;(function () {
  'use strict'

  /* imports */
  var transform = require('./transform')
  var toAsync = require('./to-async')
  var toMethod = require('./to-method')
  var argsToObject = require('./args-to-object')
  var toResult = require('./to-result')

  /* exports */
  module.exports = transform
  module.exports.toAsync = toAsync
  module.exports.toMethod = toMethod
  module.exports.argsToObject = argsToObject
  module.exports.toResult = toResult
})()

