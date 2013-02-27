var test = require("tape")

var crypto = require('crypto')
var cryptoB = require('../')

function assertSame (fn) {
  test(fn.name, function (t) {
    t.plan(1)
    fn(crypto, function (err, expected) {
      fn(cryptoB, function (err, actual) {
        t.equal(actual, expected)
        t.end()
      })
    })
  })
}

assertSame(function sha1 (crypto, cb) {
  cb(null, crypto.createHash('sha1').update('hello', 'utf-8').digest('hex'))
})

assertSame(function md5(crypto, cb) {
  cb(null, crypto.createHash('md5').update('hello', 'utf-8').digest('hex'))
})

test('randomBytes', function (t) {
  t.plan(3 + 10)
  t.equal(cryptoB.randomBytes(10).length, 10)
  cryptoB.randomBytes(10, function(ex, bytes) {
    t.error(ex)
    t.equal(bytes.length, 10)
    bytes.forEach(function(bite) {
      t.equal(typeof bite, 'number')
    })
    t.end()
  })
})
