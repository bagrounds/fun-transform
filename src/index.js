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
  var stringify = require('stringify-anything')

  /* exports */
  module.exports = funTransform
  module.exports.toAsync = toAsync
  module.exports.toMethod = toMethod
  module.exports.argsToObject = argsToObject
  module.exports.toResult = toResult

  var isFunction = funAssert.type('Function')

  var defaultOptions = {
    input: defaultInputTransformer(),
    direct: identity(),
    output: identity()
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
      function transformed () {
        return options.output(
          options.direct(subject)
            .apply(null, options.input.apply(null, arguments))
        )
      }

      transformer.toString = function toString () {
        var functions = []

        if (options.output !== defaultOptions.output) {
          functions.push(stringify(options.output))
        }

        if (options.direct !== defaultOptions.direct) {
          functions.push(stringify(options.direct))
        }

        functions.push('original')

        if (options.input !== defaultOptions.input) {
          functions.push(stringify(options.input))
        }

        return stringifyFunctions(functions)
      }

      return transformed
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

    return funTransform({
      direct: toMethod
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
      input: function argsToObject (options) {
        return keys.map(function (key) {
          return options[key]
        })
      }
    })
  }

  /**
   *
   * @method toResult
   *
   * @param {*} arguments the arguments object will be forwarded
   * @return {Function} that takes a single options object using provided keys
   */
  function toResult () {
    var input = arguments

    return funTransform({
      direct: function toResult (original) {
        return original.apply(null, input)
      }
    })
  }

  function defaultInputTransformer () {
    function inputId () {
      return arguments
    }

    inputId.toString = function toString () {
      return 'id'
    }

    return inputId
  }

  function identity () {
    function id (anything) {
      return anything
    }

    id.toString = function toString () {
      return 'id'
    }

    return id
  }

  function stringifyFunctions (functions) {
    var string = functions.pop()

    while (functions.length) {
      string = functions.pop() + '(' + string + ')'
    }

    return string
  }
})()

