'use strict';

exports.randomBytes = exports.rng = exports.pseudoRandomBytes = exports.prng = require('randombytes')

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = exports.Hash = require('create-hash')

exports.createHmac = exports.Hmac = require('create-hmac')

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}
var hashes = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'].concat(Object.keys(require('browserify-sign/algos')))
exports.getHashes = function () {
  return hashes;
}

var p = require('./pbkdf2')(exports)
exports.pbkdf2 = p.pbkdf2
exports.pbkdf2Sync = p.pbkdf2Sync

var aes = require('browserify-aes');
[
  'Cipher',
  'createCipher',
  'Cipheriv',
  'createCipheriv',
  'Decipher',
  'createDecipher',
  'Decipheriv',
  'createDecipheriv',
  'getCiphers',
  'listCiphers'
].forEach(function (key) {
  exports[key] = aes[key];
})

require('browserify-sign/inject')(module.exports, exports);
require('diffie-hellman/inject')(exports, module.exports);
require('create-ecdh/inject')(module.exports, exports);
require('public-encrypt/inject')(module.exports, exports);

// the least I can do is make error messages for the rest of the node.js/crypto api.
each([
  'createCredentials'
], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})
