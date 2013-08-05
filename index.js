var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: {
    hex: sha.hex_sha1,
    base64: sha.b64_sha1,
    binary: sha.str_sha1
  },
  sha256: {
    hex: sha256.hex_sha256,
    base64: sha256.b64_sha256,
    binary: sha256.str_sha256
  },
  md5: {
    hex: md5.hex_md5,
    base64: md5.b64_md5,
    binary: md5.bin_md5
  }
}

var algorithmsHmac = {
  sha1: {
    hex: sha.hex_hmac_sha1,
    base64: sha.b64_hmac_sha1,
    binary: sha.str_hmac_sha1
  },
  sha256: {
    hex: sha256.hex_hmac_sha256,
    base64: sha256.b64_hmac_sha256,
    binary: sha256.str_hmac_sha256
  },
  md5: {
    hex: md5.hex_hmac_md5,
    base64: md5.b64_hmac_md5,
    binary: md5.bin_hmac_md5
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

exports.createHash = function (alg) {
  alg = alg || 'sha1'
  if(!algorithms[alg])
    error('algorithm:', alg, 'is not yet supported')
  var s = ''
  var _alg = algorithms[alg]
  return {
    update: function (data) {
      s += data
      return this
    },
    digest: function (enc) {
      enc = enc || 'binary'
      var fn
      if(!(fn = _alg[enc]))
        error('encoding:', enc , 'is not yet supported for algorithm', alg)
      var r = fn(s)
      s = null //not meant to use the hash after you've called digest.
      return r
    }
  }
}

exports.createHmac = function (alg, key) {
  if (!algorithmsHmac[alg])
    error('algorithm:', alg, 'is not yet supported')
  if (typeof key != 'string')
    key = key.toString('binary')
  var s = ''
  var _alg = algorithmsHmac[alg]
  return {
    update: function (data) {
      s += data
      return this
    },
    digest: function (enc) {
      enc = enc || 'binary'
      var fn
      if (!(fn = _alg[enc]))
        error('encoding:', enc, 'is not yet support for algorithm', alg)
      var r = fn(key, s)
      s = null
      return r
    }
  }
}

exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)));
    } catch (err) { callback(err); }
  } else {
    return new Buffer(rng(size));
  }
}

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
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})
