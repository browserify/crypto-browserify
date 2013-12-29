var Buffer = require('buffer').Buffer
var sha = require('./lib/hash/sha')
var sha224 = require('./lib/hash/sha224')
var sha256 = require('./lib/hash/sha256')
var md4 = require('./lib/hash/md4')
var md5 = require('./lib/hash/md5')
var rng = require('./lib/rng/rng')
var dh = require('./lib/exchange/dh')

var algorithms = {
  sha1: sha,
  sha224: sha224,
  sha256: sha256,
  md4: md4,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  if(!alg) throw new Error('Must give hashtype string as argument')
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { if(!key) throw new TypeError('Not a buffer'); return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if(typeof(size) != 'number' || size < 0) throw new TypeError('Argument #1 must be number > 0');

  if (callback && callback.call) {
    try {
      callback.call(this, null, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}
exports.createDiffieHellman = dh.DiffieHellman;
exports.createDiffieHellmanGroup = dh.DiffieHellmanGroup;
exports.getDiffieHellman = dh.DiffieHellmanGroup;

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})
