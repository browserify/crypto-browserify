var test = require('tape');

var crypto = require('crypto');
var cryptoB = require('../');
var fs = require('fs');

var assertSame = require('./util').same

var algorithms = ['sha1', 'sha256', 'md5'];
var encodings = [/*'binary',*/ 'hex', 'base64'];


algorithms.forEach(function (algorithm) {
    encodings.forEach(function (encoding) {
        assertSame(algorithm + ' hash using ' + encoding, function (crypto, cb) {
            cb(null, crypto.createHash(algorithm).update('hellø', 'utf-8').digest(encoding));
        })

        assertSame(algorithm + ' hmac using ' + encoding, function (crypto, cb) {
            cb(null, crypto.createHmac(algorithm, 'secret').update('hellø', 'utf-8').digest(encoding))
        })
    });

    assertSame(algorithm + ' with raw binary', function (crypto, cb) {
        var seed = 'hellø';
        for (var i = 0; i < 1000; i++) {
            seed = crypto.createHash(algorithm).update(new Buffer(seed)).digest('binary');
        }
        cb(null, crypto.createHash(algorithm).update(new Buffer(seed)).digest('hex'));
    });

    assertSame(algorithm + ' empty string', function (crypto, cb) {
        cb(null, crypto.createHash(algorithm).update('').digest('hex'));
    });
});

function pad(n, w) {
  n = n + ''; return new Array(w - n.length + 1).join('0') + n;
}

test('randomBytes', function (t) {
    t.plan(5);
    t.equal(cryptoB.randomBytes(10).length, 10);
    t.ok(cryptoB.randomBytes(10) instanceof Buffer);
    cryptoB.randomBytes(10, function(ex, bytes) {
        t.error(ex);
        t.equal(bytes.length, 10);
        t.ok(bytes instanceof Buffer);
        t.end();
  });
});
