;(function () {
  'use strict'

  /* imports */
  var transform = require('./transform')

  /* exports */
  module.exports = toMethod

  /**
   *
   * @method toMethod
   *
   * @param {String} methodName the method name to choose
   * @return {Function} original[methodName]
   */
  function toMethod (methodName) {
    function toMethod (aFunction) {
      return aFunction[methodName]
    }

    toMethod.toString = function toString () {
      return '.' + methodName
    }

    return transform({
      direct: toMethod
    })
  }
})()

