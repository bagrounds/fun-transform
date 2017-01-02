;(function () {
  'use strict'

  /* imports */
  var specifier = require('specifier')
  var funAssert = require('fun-assert')

  var isFunction = funAssert.type('Function')

  var optionsSpec = {
    input: [
      isFunction
    ],
    direct: [
      isFunction
    ],
    output: [
      isFunction
    ]
  }

  module.exports = specifier(optionsSpec)
})()

