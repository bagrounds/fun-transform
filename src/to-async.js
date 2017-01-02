;(function () {
  'use strict'

  /* imports */
  var transform = require('./transform')

  /* exports */
  module.exports = toAsync

  /**
   *
   * @method toAsync
   *
   * @param {Boolean} handleErrors if true, catch errors and return in callback
   * @return {Function} an asynchronous version of sync
   */
  function toAsync (handleErrors) {
    return transform({
      direct: function toAsync (sync) {
        return function () {
          var inputs = Array.prototype.slice.call(arguments)
          var callback = inputs.pop()

          if (!handleErrors) {
            callback(null, sync.apply(null, inputs))
            return
          }

          var result, error

          try {
            result = sync.apply(null, inputs)
          } catch (e) {
            error = e
          }

          callback(error, result)
        }
      }
    })
  }
})()

