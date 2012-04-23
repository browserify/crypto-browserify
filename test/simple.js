var crypto = require('crypto')
var cryptoB = require('../')
var assert = require('assert')


function assertSame (fn) {
  fn(crypto, function (err, expected) {
    fn(cryptoB, function (err, actual) {
      assert.equal(actual, expected)
    })
  })
}

assertSame(function (crypto, cb) {
  var h = crypto.createHash('sha1')
  h.update('hello', 'utf-8')
  cb(null, h.digest('hex'))
})

