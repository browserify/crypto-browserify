var assertSame = require('./util').same
var fs = require('fs')
var test = require('tape')

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

