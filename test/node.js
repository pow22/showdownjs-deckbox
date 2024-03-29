(function () {
  'use strict';

  require('chai').should();
  var showdown = require('showdown'),
    deckbox = require('../src/index.js'),
    fs = require('fs'),
    converter = new showdown.Converter({extensions: [deckbox]}),
    cases = fs.readdirSync('test/cases/')
      .filter(filter())
      .map(map('test/cases/'));

  // Register extension
  //showdown.extensions.deckbox = twitter;

  /////////////////////////////////////////////////////////////////////////////
  // Test cases
  //
  describe('Deckbox Extension simple testcases', function () {
    for (var i = 0; i < cases.length; ++i) {
      it(cases[i].name, assertion(cases[i]));
    }
  });

  /////////////////////////////////////////////////////////////////////////////
  // Test cases
  //
  function filter() {
    return function (file) {
      var ext = file.slice(-3);
      return (ext === '.md');
    };
  }

  function map(dir) {
    return function (file) {
      var name = file.replace('.md', ''),
          htmlPath = dir + name + '.html',
          html = fs.readFileSync(htmlPath, 'utf8'),
          mdPath = dir + name + '.md',
          md = fs.readFileSync(mdPath, 'utf8');

      return {
        name:     name,
        input:    md,
        expected: html
      };
    };
  }

  //Normalize input/output
  function normalize(testCase) {

    // Normalize line returns
    testCase.expected = testCase.expected.replace(/\r/g, '');
    testCase.actual = testCase.actual.replace(/\r/g, '');

    // Ignore all leading/trailing whitespace
    testCase.expected = testCase.expected.split('\n').map(function (x) {
      return x.trim();
    }).join('\n');
    testCase.actual = testCase.actual.split('\n').map(function (x) {
      return x.trim();
    }).join('\n');

    // Remove extra lines
    testCase.expected = testCase.expected.trim();

    return testCase;

  }

  function assertion(testCase) {
    return function () {
      testCase.actual = converter.makeHtml(testCase.input);
      testCase = normalize(testCase);

      // Compare
      testCase.actual.should.equal(testCase.expected);
    };
  }
})();
