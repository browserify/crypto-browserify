var test = require("tape")

var crypto = require('crypto')
var cryptoB = require('../')

function assertSame(name, fn) {
  test(name, function (t) {
    t.plan(1)
    fn(crypto, function (err, expected) {
      fn(cryptoB, function (err, actual) {
        t.equal(actual, expected)
        t.end()
      })
    })
  })
}

var algorithms = ['sha1', 'sha256', 'md5'];
var encodings = ['binary', 'hex', 'base64'];


algorithms.forEach(function (algorithm) {
    encodings.forEach(function (encoding) {

        assertSame(algorithm + ' hash using ' + encoding, function (crypto, cb) {
            cb(null, crypto.createHash(algorithm).update('hello', 'utf-8').digest(encoding));
        })

        assertSame(algorithm + ' hmac using ' + encoding, function (crypto, cb) {
            cb(null, crypto.createHmac(algorithm, 'secret').update('hello', 'utf-8').digest(encoding))
        })

    });
});

test('randomBytes', function (t) {
  t.plan(5)
  t.equal(cryptoB.randomBytes(10).length, 10)
  t.ok(cryptoB.randomBytes(10) instanceof Buffer)
  cryptoB.randomBytes(10, function(ex, bytes) {
    t.error(ex)
    t.equal(bytes.length, 10)
    t.ok(bytes instanceof Buffer)
    t.end()
  })
})
