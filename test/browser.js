var crypto = require('../')
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
        var vectorHashes = {
          "md5": {
            "Test123": {
              "hex": "68eacb97d86f0c4621fa2b0e17cabd8c",
              "binary": "hêËØo\fF!ú+\u000e\u0017Ê½",
              "base64": "aOrLl9hvDEYh+isOF8q9jA=="
            },
            "hellø": {
              "hex": "33e1ac4932f100ccace689068e2c60f3"
            }
          },
          "sha1": {
            "Test123": {
              "hex": "8308651804facb7b9af8ffc53a33a22d6a1c8ac2",
              "binary": "\be\u0018\u0004úË{øÿÅ:3¢-j\u001cÂ",
              "base64": "gwhlGAT6y3ua+P/FOjOiLWocisI="
            },
            "hellø": {
              "hex": "1921ff95d534deda9c9d128b8c10780ed626306f"
            }
          },
          "sha256": {
            "Test123": {
              "hex": "d9b5f58f0b38198293971865a14074f59eba3e82595becbe86ae51f1d9f1f65e",
              "binary": "Ùµõ\u000b8\u0019\u0018e¡@tõº>Y[ì¾®QñÙñö^",
              "base64": "2bX1jws4GYKTlxhloUB09Z66PoJZW+y+hq5R8dnx9l4="
            },
            "hellø": {
              "hex": "83f5941b668fede77b738609586ad8fe31730e864c529d78ee3d9e68b9ba712f"
            }
          }
        };

        algorithms.forEach(function(algo){
          describe(algo.toUpperCase(), function() {
              it('should calculate the correct hash in hex', function() {
                var browserify = crypto.createHash(algo).update('Test123').digest('hex');
                expect(browserify).to.equal(vectorHashes[algo]['Test123'].hex);
              })
              it('should calculate the correct hash in base64', function() {
                var browserify = crypto.createHash(algo).update('Test123').digest('base64');
                expect(browserify).to.equal(vectorHashes[algo]['Test123'].base64);
              })
              it('should calculate the correct hash in binary', function() {
                var browserify = crypto.createHash(algo).update('Test123').digest('binary');
                expect(browserify).to.equal(vectorHashes[algo]['Test123'].binary);
              })
              it('should use Buffer as the default digest', function() {
                var browserify = crypto.createHash(algo).update('Test123').digest();
                expect(browserify).to.a(Buffer);
              })
              it('should calculate the correct hash when multiple updates are called', function() {
                var browserify = crypto.createHash(algo).update('Test').update('123').digest('hex');
                expect(browserify).to.equal(vectorHashes[algo]['Test123'].hex);

                var h1 = crypto.createHash(algo).update('Test123').digest('hex');
                var h2 = crypto.createHash(algo).update('Test').update('123').digest('hex');
                expect(h1).to.equal(h2);
              })
              it('should calculate the correct hash for utf-8 data', function() {
                var browserify = crypto.createHash(algo).update('hellø', 'utf8').digest('hex');
                expect(browserify).to.equal(vectorHashes[algo]['hellø'].hex);
              })
              it('should not care if encoding is utf8 or utf-8', function() {
                var browserify_dash = crypto.createHash(algo).update('hellø', 'utf-8').digest('hex');
                var browserify_nodash = crypto.createHash(algo).update('hellø', 'utf8').digest('hex');
                expect(browserify_dash).to.equal(browserify_nodash);
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

        var algorithms = [ 'md5', 'sha1', 'sha256' ];
        var vectorHmacs = {
          "md5": {
            "Test123": {
              "hex": "d2058455d95509c4e41750682180205a",
              "binary": "Ò\u0005UÙU\tÄä\u0017Ph! Z",
              "base64": "0gWEVdlVCcTkF1BoIYAgWg=="
            },
            "hellø": {
              "hex": "5885fc2b6b889c07cb53883414168801"
            }
          },
          "sha1": {
            "Test123": {
              "hex": "399b37f7cb45cf158168150c3743a2ecfa587295",
              "binary": "97÷ËEÏ\u0015h\u0015\f7C¢ìúXr",
              "base64": "OZs398tFzxWBaBUMN0Oi7PpYcpU="
            },
            "hellø": {
              "hex": "2fd8401b3e82695b879310da040eb96fa7eebeef"
            }
          },
          "sha256": {
            "Test123": {
              "hex": "04939d2e4d96cc5d03c600f8fc7afbc50559333e31e349abafca0dbb757998e0",
              "binary": "\u0004.MÌ]\u0003Æ\u0000øüzûÅ\u0005Y3>1ãI«¯Ê\r»uyà",
              "base64": "BJOdLk2WzF0DxgD4/Hr7xQVZMz4x40mrr8oNu3V5mOA="
            },
            "hellø": {
              "hex": "77c440dd0ec6b18045ee72e54ff89dbb332184fa6e4587334dcdd321caa12068"
            }
          }
        }

        algorithms.forEach(function(algo){
          describe(algo.toUpperCase(), function() {
              it('should calculate the correct hmac in hex', function() {
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest('hex');
                expect(browserify).to.equal(vectorHmacs[algo]['Test123'].hex);
              })
              it('should calculate the correct hmac in base64', function() {
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest('base64');
                expect(browserify).to.equal(vectorHmacs[algo]['Test123'].base64);
              })
              it('should calculate the correct hmac in binary', function() {
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest('binary');
                expect(browserify).to.equal(vectorHmacs[algo]['Test123'].binary);
              })
              it('should calculate the correct hmac when no digest is passed', function() {
                var browserify = crypto.createHmac(algo, 'boo').update('Test123').digest();
                expect(browserify).to.be.a(Buffer);
              })
              it('should calculate the correct hmac when multiple updates are called', function() {
                var browserify = crypto.createHmac(algo, 'boo').update('Test').update('123').digest('hex');
                expect(browserify).to.equal(vectorHmacs[algo]['Test123'].hex);

                var h1 = crypto.createHmac(algo, 'boo').update('Test123').digest('hex');
                var h2 = crypto.createHmac(algo, 'boo').update('Test').update('123').digest('hex');
                expect(h1).to.equal(h2);
              })
              it('should calculate the correct hmac for utf-8 data', function() {
                var browserify = crypto.createHmac(algo, 'boo').update('hellø', 'utf8').digest('hex');
                expect(browserify).to.equal(vectorHmacs[algo]['hellø'].hex);
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