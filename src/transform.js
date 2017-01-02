;(function () {
  'use strict'

  /* imports */
  var defaults = require('lodash.defaults')
  var stringify = require('stringify-anything')
  var optionsChecker = require('./spec-options-transform')

  /* exports */
  module.exports = transform

  var defaultOptions = {
    input: defaultInputTransformer(),
    direct: identity(),
    output: identity()
  }

  /**
   *
   * @function transform
   *
   * @param {Object} options all input parameters
   * @param {Function} [options.input] applied to input
   * @param {Function} [options.direct] applied directly to function
   * @param {Function} [options.output] applied to output
   * @return {Function} function(aFunction) -> transformedFunction
   */
  function transform (options) {
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

