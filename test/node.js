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

        var algorithms = [ 'md5', 'sha1', 'sha224', 'sha256' ];
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
          'sha224': [
            'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
            '23fa1e672a6c2acdc4d7bfae713e0c9337ba057b5d5ace2685b59321',
            '561c8bf49dc2d996ef5e48c90f33bf020b8e5cf6cbab12910e212593',
            'bad5ffb737a22625b1fefab26f330668f31d5bb19e2b61787971ea81'
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
              it('should use Buffer as the default digest', function() {
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

    describe('HMAC', function() {
        it('should not allow update after digest', function() {
          var hmac = crypto.createHmac('sha1', 'boo');
          hmac.update('test');
          hmac.digest('hex');
          expect(hmac.update).withArgs('test').to.throwException();
        })

        describe('#createHmac()', function() {
            it('should throw when no arguments are passed in', function() {
              expect(crypto.createHmac).withArgs().to.throwException();
            })

            it('should throw when no key is passed in', function() {
              expect(crypto.createHmac).withArgs('sha1').to.throwException();
            })

            it('should throw when an algorithm is invalid', function() {
              expect(crypto.createHmac).withArgs('boo', 'test').to.throwException();
            })
        })

        var algorithms = [ 'md5', 'sha1', 'sha224', 'sha256' ];

        algorithms.forEach(function(algo){
          describe(algo.toUpperCase(), function() {
              it('should calculate the correct hmac in hex', function() {
                var node = nodecrypto.createHmac(algo, 'boo').update('Test123').digest('hex');
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest('hex');
                expect(browserify).to.equal(node);
              })
              it('should calculate the correct hmac in base64', function() {
                var node = nodecrypto.createHmac(algo, 'boo').update('Test123').digest('base64');
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest('base64');
                expect(browserify).to.equal(node);
              })
              it('should calculate the correct hmac in binary', function() {
                var node = nodecrypto.createHmac(algo, 'boo').update('Test123').digest('binary');
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest('binary');
                expect(browserify).to.equal(node);
              })
              it('should calculate the correct hmac when no digest is passed', function() {
                // This test fails on node 0.8 due to API changes documented here:
                // http://nodejs.org/api/crypto.html#crypto_recent_api_changes
                if(/0\.8\..+/.test(process.versions.node)) return;

                var node = nodecrypto.createHmac(algo, 'boo').update('Test123').digest();
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest();
                expect(browserify).to.eql(node); // Please note 'eql', deep equality!!!!
              })
              it('should calculate the correct hmac when multiple updates are called', function() {
                var node = nodecrypto.createHmac(algo, 'boo').update('Test').update('123').digest('hex');
                var browserify = crypto.createHmac(algo, 'boo').update('Test').update('123').digest('hex');
                expect(browserify).to.equal(node);

                var h1 = crypto.createHmac(algo, 'boo').update('Test123').digest('hex');
                var h2 = crypto.createHmac(algo, 'boo').update('Test').update('123').digest('hex');
                expect(h1).to.equal(h2);
              })
              it('should calculate the correct hmac for utf-8 data', function() {
                var node = nodecrypto.createHmac(algo, 'boo').update('hellø', 'utf8').digest('hex');
                var browserify = crypto.createHmac(algo, 'boo').update('hellø', 'utf8').digest('hex');
                expect(browserify).to.equal(node);
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
                  var rand = crypto.randomBytes(len);
                  expect(rand).to.have.length(len);
                  expect(rand).to.be.a(Buffer);
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