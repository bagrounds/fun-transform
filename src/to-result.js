;(function () {
  'use strict'

  /* imports */
  var transform = require('./transform')

  /* exports */
  module.exports = toResult

  /**
   *
   * @method toResult
   *
   * @param {*} arguments the arguments object will be forwarded
   * @return {Function} that takes a single options object using provided keys
   */
  function toResult () {
    var input = arguments

    return transform({
      direct: function toResult (original) {
        return original.apply(null, input)
      }
    })
  }
})()

