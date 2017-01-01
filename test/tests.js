;(function () {
  'use strict'

  /* imports */
  var funTest = require('fun-test')
  var funAssert = require('fun-assert')

  /* exports */
  module.exports = [
    {
      sync: true
    },
    {
      input: {
        input: inputTransformer,
        output: outputTransformer
      },
      result: funAssert.type('Function'),
      sync: true
    },
    {
      input: {
        a: 5,
        b: 8
      },
      transformer: testResult({
        input: {
          input: inputTransformer
        },
        subject: testFunction
      }),
      result: funAssert.equal(13),
      sync: true
    },
    {
      input: {
        a: 5,
        b: 8
      },
      transformer: testResult({
        input: {
          input: inputTransformer,
          output: outputTransformer
        },
        subject: testFunction
      }),
      result: funAssert.equal({
        result: 13
      }),
      sync: true
    },
    {
      input: 5,
      transformer: testResult({
        input: {
          output: outputTransformer
        },
        subject: testFunction
      }),
      result: funAssert.equal({
        result: 5
      }),
      sync: true
    },
    {
      input: testFunction,
      transformer: testResult({
        input: true,
        method: 'toAsync'
      }),
      result: funAssert.type('Function'),
      sync: true
    },
    {
      input: 6,
      transformer: testResult({
        input: true,
        subject: testFunction,
        method: 'toAsync'
      }),
      result: funAssert.equal(6)
    },
    {
      input: 6,
      transformer: testResult({
        input: false,
        subject: testFunction,
        method: 'toAsync'
      }),
      result: funAssert.equal(6)
    },
    {
      input: true,
      transformer: testResult({
        input: true,
        subject: throwOrOne,
        method: 'toAsync'
      }),
      error: funAssert.truthy
    },
    {
      input: true,
      transformer: testResult({
        input: false,
        subject: throwOrOne,
        method: 'toAsync'
      }),
      error: funAssert.truthy
    },
    {
      input: {
        aMethod: testFunction
      },
      transformer: testResult({
        input: 'aMethod',
        method: 'toMethod'
      }),
      result: funAssert.type('Function'),
      sync: true
    },
    {
      input: 9,
      transformer: testResult({
        input: 'aMethod',
        subject: {
          aMethod: testFunction
        },
        method: 'toMethod'
      }),
      result: funAssert.equal(9),
      sync: true
    },
    {
      input: ['a', 'b'],
      transformer: testResult({
        method: 'argsToObject'
      }),
      result: funAssert.type('Function'),
      sync: true
    },
    {
      input: {
        a: 4,
        b: 8
      },
      transformer: testResult({
        input: ['a', 'b'],
        subject: testFunction,
        method: 'argsToObject'
      }),
      result: funAssert.equal(12),
      sync: true
    }
  ].map(funTest)

  function throwOrOne (shouldThrow) {
    if (shouldThrow) {
      throw new Error('throwing intentially')
    }

    return 1
  }

  function testFunction (a, b) {
    return a + (b || 0)
  }

  function testResult (options) {
    return function transformed (funTransform) {
      var fut = funTransform

      if (options.method !== undefined) {
        fut = fut[options.method]
      }

      if (options.input !== undefined) {
        fut = fut(options.input)
      }

      if (options.subject !== undefined) {
        fut = fut(options.subject)
      }

      return fut
    }
  }

  function inputTransformer (options) {
    return [options.a, options.b]
  }

  function outputTransformer (result) {
    return {
      result: result
    }
  }
})()

