;(function () {
  'use strict'

  /* imports */
  var transform = require('./transform')

  /* exports */
  module.exports = argsToObject

  /**
   *
   * @method argsToObject
   *
   * @param {Array} keys to use for each input argument
   * @return {Function} that takes a single options object using provided keys
   */
  function argsToObject (keys) {
    return transform({
      input: function argsToObject (options) {
        return keys.map(function (key) {
          return options[key]
        })
      }
    })
  }
})()

