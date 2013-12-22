var nodecrypto = require('crypto')
  , crypto = require('../')
  , fs = require('fs')
  , path = require('path')
  , expect = require('expect.js');

describe('Crypto', function() {
    it('should expose a createHash function', function() {
        expect(crypto.createHash).to.be.a('function');
        expect(crypto.createHash).not.throwException(/is not implemented yet$/);
    })

    it('should expose a createHmac function', function() {
        expect(crypto.createHmac).to.be.a('function');
        expect(crypto.createHmac).not.throwException(/is not implemented yet$/);
    })

    it('should expose a randomBytes function', function() {
        expect(crypto.randomBytes).to.be.a('function');
        //expect(crypto.randomBytes).withArgs(1).not.throwException();
    })

    describe('Hash', function() {
        describe('#createHash()', function() {
            it('should throw when no algorithm is passed in', function() {
              expect(crypto.createHash).withArgs().to.throwException();
            })

            it('should throw when a algorithm is invalid', function() {
              expect(crypto.createHash).withArgs('boo').to.throwException();
            })
        })

        var algorithms = [ 'md5', 'sha1', 'sha256' ];
        var vectors = path.join(path.dirname(__filename), 'vectors');
        var vectorHashes = {
          'md5': [
            'd41d8cd98f00b204e9800998ecf8427e',
            'c3e97dd6e97fb5125688c97f36720cbe',
            'e035f9e748a2a09a4fbdcf18c4f58bf1',
            'c9b4b691f4d88b7d2b4d5b770b05c8bf'
          ],
          'sha1': [
            'da39a3ee5e6b4b0d3255bfef95601890afd80709',
            '3cdf2936da2fc556bfa533ab1eb59ce710ac80e5',
            'a6b5b9f854cfb76701c3bddbf374b3094ea49cba',
            '7b0fa84ebbcff7d7f4500f73d79660c4a3431b67'
          ],
          'sha256': [
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            '09fc96082d34c2dfc1295d92073b5ea1dc8ef8da95f14dfded011ffb96d3e54b',
            '2cc06402328f034d1909fa7b95f34cdb5585ce7f9096bc4082c97904921f6304',
            '1e858dd15069f54478023c4d8518cd5aa814fb15c9eb8df45c44efbb050587ed'
          ]
        };

        algorithms.forEach(function(algo){
          describe(algo.toUpperCase(), function() {
              it('should calculate the correct hash in hex', function() {
                var node = nodecrypto.createHash(algo).update('Test123').digest('hex');
                var browserify = crypto.createHash(algo).update('Test123').digest('hex');
                expect(browserify).to.equal(node);
              })
              it('should calculate the correct hash in base64', function() {
                var node = nodecrypto.createHash(algo).update('Test123').digest('base64');
                var browserify = crypto.createHash(algo).update('Test123').digest('base64');
                expect(browserify).to.equal(node);
              })
              it('should calculate the correct hash in binary', function() {
                var node = nodecrypto.createHash(algo).update('Test123').digest('binary');
                var browserify = crypto.createHash(algo).update('Test123').digest('binary');
                expect(browserify).to.equal(node);
              })
              it('should calculate the correct hash when no digest is passed', function() {
                // This test fails on node 0.8 due to API changes documented here:
                // http://nodejs.org/api/crypto.html#crypto_recent_api_changes
                if(/0\.8\..+/.test(process.versions.node)) return;

                var node = nodecrypto.createHash(algo).update('Test123').digest();
                var browserify = crypto.createHash(algo).update('Test123').digest();
                expect(browserify).to.eql(node); // Please note 'eql', deep equality!!!!
              })
              it('should calculate the correct hash when multiple updates are called', function() {
                var node = nodecrypto.createHash(algo).update('Test').update('123').digest('hex');
                var browserify = crypto.createHash(algo).update('Test').update('123').digest('hex');
                expect(browserify).to.equal(node);

                var h1 = crypto.createHash(algo).update('Test123').digest('hex');
                var h2 = crypto.createHash(algo).update('Test').update('123').digest('hex');
                expect(h1).to.equal(h2);
              })
              it('should calculate the correct hash for utf-8 data', function() {
                var node = nodecrypto.createHash(algo).update('hellø', 'utf8').digest('hex');
                var browserify = crypto.createHash(algo).update('hellø', 'utf8').digest('hex');
                expect(browserify).to.equal(node);
              })
              it('should not care if encoding is utf8 or utf-8', function() {
                var browserify_dash = crypto.createHash(algo).update('hellø', 'utf-8').digest('hex');
                var browserify_nodash = crypto.createHash(algo).update('hellø', 'utf8').digest('hex');
                expect(browserify_dash).to.equal(browserify_nodash);
              })
              it('should calculate the correct hash for test file 0', function(done) {
                var vector = path.join(vectors, 'byte0000.dat');
                var hash = crypto.createHash(algo);
                var filestream = fs.createReadStream(vector);
                filestream.on('data', function(data) {
                  hash.update(data);
                });
                filestream.on('close', function() {
                  expect(hash.digest('hex')).to.equal(vectorHashes[algo][0]);
                  done();
                });
              })
              it('should calculate the correct hash for test file 1', function(done) {
                var vector = path.join(vectors, 'byte0001.dat');
                var hash = crypto.createHash(algo);
                var filestream = fs.createReadStream(vector);
                filestream.on('data', function(data) {
                  hash.update(data);
                });
                filestream.on('close', function() {
                  expect(hash.digest('hex')).to.equal(vectorHashes[algo][1]);
                  done();
                });
              })
              it('should calculate the correct hash for test file 2', function(done) {
                var vector = path.join(vectors, 'byte0002.dat');
                var hash = crypto.createHash(algo);
                var filestream = fs.createReadStream(vector);
                filestream.on('data', function(data) {
                  hash.update(data);
                });
                filestream.on('close', function() {
                  expect(hash.digest('hex')).to.equal(vectorHashes[algo][2]);
                  done();
                });
              })
              it('should calculate the correct hash for test file 3', function(done) {
                var vector = path.join(vectors, 'byte0003.dat');
                var hash = crypto.createHash(algo);
                var filestream = fs.createReadStream(vector);
                filestream.on('data', function(data) {
                  hash.update(data);
                });
                filestream.on('close', function() {
                  expect(hash.digest('hex')).to.equal(vectorHashes[algo][3]);
                  done();
                });
              })
          })
        });
    })

    describe('RNG', function() {
        describe('#randomBytes()', function() {
            it('should throw on invalid arguments', function() {
                [-1,
                  undefined,
                  null,
                  false,
                  true,
                  {},
                  []
                ].forEach(function(value) {
                    expect(function() { crypto.randomBytes(value) }).to.throwException();
                    expect(function() { crypto.randomBytes(value, function() {}) }).to.throwException();
                })
            })

            it('should return the requested amount of bytes', function() {
                [0, 1, 2, 4, 16, 256, 1024].forEach(function(len) {
                  expect(crypto.randomBytes(len)).to.have.length(len);
                });
            })

            it('should pass a buffer to the callback', function(done) {
              crypto.randomBytes(16, function(err, data) {
                expect(err).to.be(null);
                expect(data).to.have.length(16);
                expect(data).to.be.a(Buffer);
                done();
              })
            })
        })
    })
})




/*function assertSame(name, fn) {
    test(name, function (t) {
        t.plan(1);
        fn(crypto, function (err, expected) {
            fn(cryptoB, function (err, actual) {
                t.equal(actual, expected);
                t.end();
            });
        });
    });
}

var algorithms = ['sha1', 'sha256', 'md5'];
var encodings = ['binary', 'hex', 'base64'];


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

var vectors = fs.readdirSync(__dirname + '/vectors').sort().
    filter(function (t) { return t.match(/\.dat$/); }).
    map(function (t) { return fs.readFileSync(__dirname + '/vectors/' + t); });

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
*/