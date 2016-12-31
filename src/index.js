/**
 *
 * @module fun-transform
 */
;(function () {
  'use strict'

  /* imports */
  var defaults = require('lodash.defaults')
  var specifier = require('specifier')
  var funAssert = require('fun-assert')

  /* exports */
  module.exports = funTransform
  module.exports.toAsync = toAsync
  module.exports.toMethod = toMethod
  module.exports.argsToObject = argsToObject

  var isFunction = funAssert.type('Function')

  var defaultOptions = {
    input: defaultInputTransformer,
    direct: identity,
    output: identity
  }

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

  var optionsChecker = specifier(optionsSpec)

  /**
   *
   * @function funTransform
   * @alias fun-transform
   *
   * @param {Object} options all input parameters
   * @param {Function} [options.input] applied to input
   * @param {Function} [options.direct] applied directly to function
   * @param {Function} [options.output] applied to output
   * @return {Function} function(aFunction) -> transformedFunction
   */
  function funTransform (options) {
    options = optionsChecker(defaults(options, defaultOptions))

    return function transformer (subject) {
      return function transformed () {
        return options.output(
          options.direct(subject)
            .apply(null, options.input.apply(null, arguments))
        )
      }
    }
  }

  /**
   *
   * @method toAsync
   *
   * @param {Boolean} handleErrors if true, catch errors and return in callback
   * @return {Function} an asynchronous version of sync
   */
  function toAsync (handleErrors) {
    return funTransform({
      direct: function (sync) {
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

  /**
   *
   * @method toMethod
   *
   * @param {String} methodName the method name to choose
   * @return {Function} original[methodName]
   */
  function toMethod (methodName) {
    return funTransform({
      direct: function (aFunction) {
        return aFunction[methodName]
      }
    })
  }

  /**
   *
   * @method argsToObject
   *
   * @param {Array} keys to use for each input argument
   * @return {Function} that takes a single options object using provided keys
   */
  function argsToObject (keys) {
    return funTransform({
      input: function (options) {
        return keys.map(function (key) {
          return options[key]
        })
      }
    })
  }

  function defaultInputTransformer () {
    return arguments
  }

  function identity (anything) {
    return anything
  }
})()

