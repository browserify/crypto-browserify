var fs = require('fs')
var test = require('tape')
var cryptoB = require('../')

var vectors = fs.readdirSync(__dirname + '/vectors').sort().
    filter(function (t) { return t.match(/\.dat$/); }).
    map(function (t) { return fs.readFileSync(__dirname + '/vectors/' + t); });

function pad(n, w) {
  n = n + ''; return new Array(w - n.length + 1).join('0') + n;
}

['md5', 'sha1', 'sha256'].forEach(function (algorithm) {
    test(algorithm, function (t) {
        function hash(data) { return cryptoB.createHash(algorithm).update(data).digest('hex'); }

        var hashes = fs.readFileSync(__dirname + '/vectors/byte-hashes.' + algorithm).toString().split(/\r?\n/);
        t.plan(vectors.length);
        for (var i = 0; i < vectors.length; i++) {
            t.equal(hash(vectors[i]), hashes[i], 'byte' + pad(i, 4) + '.dat');
        }
    });
});

