#!/usr/bin/env node
;(function () {
  'use strict'

  /* imports */
  var funTestRunner = require('fun-test-runner')
  var tests = require('./tests')

  var subject = require('../src/')

  main()

  function main () {
    var options = {
      subject: subject,
      tests: tests
    }

    funTestRunner(options, function (error) {
      error && console.error(error)

      console.log('done')
    })
  }
})()

