# crypto-browserify

A port of node's `crypto` module to the browser.

[![NPM Package](https://img.shields.io/npm/v/crypto-browserify.svg?style=flat-square)](https://www.npmjs.org/package/crypto-browserify)
[![Build Status](https://img.shields.io/travis/crypto-browserify/crypto-browserify.svg?branch=master&style=flat-square)](https://travis-ci.org/crypto-browserify/crypto-browserify)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/crypto-browserify.svg)](https://saucelabs.com/u/crypto-browserify)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

The goal of this module is to reimplement node's crypto module,
in pure javascript so that it can run in the browser.

Here is the subset that is currently implemented:

* createHash (sha1, sha224, sha256, sha384, sha512, md5, rmd160)
* createHmac (sha1, sha224, sha256, sha384, sha512, md5, rmd160)
* pbkdf2
* pbkdf2Sync
* randomBytes
* pseudoRandomBytes
* createCipher (aes)
* createDecipher (aes)
* createDiffieHellman
* createSign (rsa, ecdsa)
* createVerify (rsa, ecdsa)
* createECDH (secp256k1)
* publicEncrypt/privateDecrypt (rsa)
* privateEncrypt/publicDecrypt (rsa)

## todo

these features from node's `crypto` are still unimplemented.

* createCredentials

## contributions

If you are interested in writing a feature, please implement as a new module,
which will be incorporated into crypto-browserify as a dependency.

All deps must be compatible with node's crypto
(generate example inputs and outputs with node,
and save base64 strings inside JSON, so that tests can run in the browser.
see [crypto-browserify/sha.js](https://github.com/crypto-browserify/sha.js)

Crypto is _extra serious_ so please do not hesitate to review the code,
and post comments if you do.

## dependencies tree
<!-- rdtree-start -->
- [crypto-browserify](#crypto-browserify)
  - [browserify-cipher](#browserify-cipher)
    - [browserify-aes](#browserify-aes)
      - [buffer-xor](#buffer-xor)
      - [cipher-base](#cipher-base)
      - [create-hash](#create-hash)
      - [evp_bytestokey](#evp_bytestokey)
      - [inherits](#inherits)
    - [browserify-des](#browserify-des)
      - [cipher-base](#cipher-base)
      - [des.js](#desjs)
        - [inherits](#inherits)
        - [minimalistic-assert](#minimalistic-assert)
      - [inherits](#inherits)
    - [evp_bytestokey](#evp_bytestokey)
      - [create-hash](#create-hash)
  - [browserify-sign](#browserify-sign)
    - [bn.js](#bnjs)
    - [browserify-rsa](#browserify-rsa)
      - [bn.js](#bnjs)
      - [randombytes](#randombytes)
    - [create-hash](#create-hash)
    - [create-hmac](#create-hmac)
    - [elliptic](#elliptic)
      - [bn.js](#bnjs)
      - [brorand](#brorand)
      - [hash.js](#hashjs)
        - [inherits](#inherits)
      - [inherits](#inherits)
    - [inherits](#inherits)
    - [parse-asn1](#parse-asn1)
      - [asn1.js](#asn1js)
        - [bn.js](#bnjs)
        - [inherits](#inherits)
        - [minimalistic-assert](#minimalistic-assert)
      - [browserify-aes](#browserify-aes)
      - [create-hash](#create-hash)
      - [evp_bytestokey](#evp_bytestokey)
      - [pbkdf2](#pbkdf2)
  - [create-ecdh](#create-ecdh)
    - [bn.js](#bnjs)
    - [elliptic](#elliptic)
  - [create-hash](#create-hash)
    - [cipher-base](#cipher-base)
      - [inherits](#inherits)
    - [inherits](#inherits)
    - [ripemd160](#ripemd160)
    - [sha.js](#shajs)
      - [inherits](#inherits)
  - [create-hmac](#create-hmac)
    - [create-hash](#create-hash)
    - [inherits](#inherits)
  - [diffie-hellman](#diffie-hellman)
    - [bn.js](#bnjs)
    - [miller-rabin](#miller-rabin)
      - [bn.js](#bnjs)
      - [brorand](#brorand)
    - [randombytes](#randombytes)
  - [inherits](#inherits)
  - [pbkdf2](#pbkdf2)
    - [create-hmac](#create-hmac)
  - [public-encrypt](#public-encrypt)
    - [bn.js](#bnjs)
    - [browserify-rsa](#browserify-rsa)
    - [create-hash](#create-hash)
    - [parse-asn1](#parse-asn1)
    - [randombytes](#randombytes)
  - [randombytes](#randombytes)

| package | npm | dependencies | github issues |
|:-:|:-:|:-:|:-:|
| <h6><a href="https://github.com/indutny/asn1.js">asn1.js</a></h6> | [![](https://img.shields.io/npm/v/asn1.js.svg?style=flat-square)](https://www.npmjs.org/package/asn1.js) | [![](https://img.shields.io/david/indutny/asn1.js.svg?style=flat-square)](https://david-dm.org/indutny/asn1.js#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/asn1.js.svg?style=flat-square)](https://github.com/indutny/asn1.js/issues) |
| <h6><a href="https://github.com/indutny/bn.js">bn.js</a></h6> | [![](https://img.shields.io/npm/v/bn.js.svg?style=flat-square)](https://www.npmjs.org/package/bn.js) | [![](https://img.shields.io/david/indutny/bn.js.svg?style=flat-square)](https://david-dm.org/indutny/bn.js#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/bn.js.svg?style=flat-square)](https://github.com/indutny/bn.js/issues) |
| <h6><a href="https://github.com/indutny/brorand">brorand</a></h6> | [![](https://img.shields.io/npm/v/brorand.svg?style=flat-square)](https://www.npmjs.org/package/brorand) | [![](https://img.shields.io/david/indutny/brorand.svg?style=flat-square)](https://david-dm.org/indutny/brorand#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/brorand.svg?style=flat-square)](https://github.com/indutny/brorand/issues) |
| <h6><a href="https://github.com/crypto-browserify/browserify-aes">browserify-aes</a></h6> | [![](https://img.shields.io/npm/v/browserify-aes.svg?style=flat-square)](https://www.npmjs.org/package/browserify-aes) | [![](https://img.shields.io/david/crypto-browserify/browserify-aes.svg?style=flat-square)](https://david-dm.org/crypto-browserify/browserify-aes#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/browserify-aes.svg?style=flat-square)](https://github.com/crypto-browserify/browserify-aes/issues) |
| <h6><a href="https://github.com/crypto-browserify/browserify-cipher">browserify-cipher</a></h6> | [![](https://img.shields.io/npm/v/browserify-cipher.svg?style=flat-square)](https://www.npmjs.org/package/browserify-cipher) | [![](https://img.shields.io/david/crypto-browserify/browserify-cipher.svg?style=flat-square)](https://david-dm.org/crypto-browserify/browserify-cipher#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/browserify-cipher.svg?style=flat-square)](https://github.com/crypto-browserify/browserify-cipher/issues) |
| <h6><a href="https://github.com/crypto-browserify/browserify-des">browserify-des</a></h6> | [![](https://img.shields.io/npm/v/browserify-des.svg?style=flat-square)](https://www.npmjs.org/package/browserify-des) | [![](https://img.shields.io/david/crypto-browserify/browserify-des.svg?style=flat-square)](https://david-dm.org/crypto-browserify/browserify-des#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/browserify-des.svg?style=flat-square)](https://github.com/crypto-browserify/browserify-des/issues) |
| <h6><a href="https://github.com/crypto-browserify/browserify-rsa">browserify-rsa</a></h6> | [![](https://img.shields.io/npm/v/browserify-rsa.svg?style=flat-square)](https://www.npmjs.org/package/browserify-rsa) | [![](https://img.shields.io/david/crypto-browserify/browserify-rsa.svg?style=flat-square)](https://david-dm.org/crypto-browserify/browserify-rsa#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/browserify-rsa.svg?style=flat-square)](https://github.com/crypto-browserify/browserify-rsa/issues) |
| <h6><a href="https://github.com/crypto-browserify/browserify-sign">browserify-sign</a></h6> | [![](https://img.shields.io/npm/v/browserify-sign.svg?style=flat-square)](https://www.npmjs.org/package/browserify-sign) | [![](https://img.shields.io/david/crypto-browserify/browserify-sign.svg?style=flat-square)](https://david-dm.org/crypto-browserify/browserify-sign#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/browserify-sign.svg?style=flat-square)](https://github.com/crypto-browserify/browserify-sign/issues) |
| <h6><a href="https://github.com/crypto-browserify/buffer-xor">buffer-xor</a></h6> | [![](https://img.shields.io/npm/v/buffer-xor.svg?style=flat-square)](https://www.npmjs.org/package/buffer-xor) | [![](https://img.shields.io/david/crypto-browserify/buffer-xor.svg?style=flat-square)](https://david-dm.org/crypto-browserify/buffer-xor#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/buffer-xor.svg?style=flat-square)](https://github.com/crypto-browserify/buffer-xor/issues) |
| <h6><a href="https://github.com/crypto-browserify/cipher-base">cipher-base</a></h6> | [![](https://img.shields.io/npm/v/cipher-base.svg?style=flat-square)](https://www.npmjs.org/package/cipher-base) | [![](https://img.shields.io/david/crypto-browserify/cipher-base.svg?style=flat-square)](https://david-dm.org/crypto-browserify/cipher-base#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/cipher-base.svg?style=flat-square)](https://github.com/crypto-browserify/cipher-base/issues) |
| <h6><a href="https://github.com/crypto-browserify/createECDH">create-ecdh</a></h6> | [![](https://img.shields.io/npm/v/create-ecdh.svg?style=flat-square)](https://www.npmjs.org/package/create-ecdh) | [![](https://img.shields.io/david/crypto-browserify/createECDH.svg?style=flat-square)](https://david-dm.org/crypto-browserify/createECDH#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/createECDH.svg?style=flat-square)](https://github.com/crypto-browserify/createECDH/issues) |
| <h6><a href="https://github.com/crypto-browserify/createHash">create-hash</a></h6> | [![](https://img.shields.io/npm/v/create-hash.svg?style=flat-square)](https://www.npmjs.org/package/create-hash) | [![](https://img.shields.io/david/crypto-browserify/createHash.svg?style=flat-square)](https://david-dm.org/crypto-browserify/createHash#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/createHash.svg?style=flat-square)](https://github.com/crypto-browserify/createHash/issues) |
| <h6><a href="https://github.com/crypto-browserify/createHmac">create-hmac</a></h6> | [![](https://img.shields.io/npm/v/create-hmac.svg?style=flat-square)](https://www.npmjs.org/package/create-hmac) | [![](https://img.shields.io/david/crypto-browserify/createHmac.svg?style=flat-square)](https://david-dm.org/crypto-browserify/createHmac#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/createHmac.svg?style=flat-square)](https://github.com/crypto-browserify/createHmac/issues) |
| <h6><a href="https://github.com/crypto-browserify/crypto-browserify">crypto-browserify</a></h6> | [![](https://img.shields.io/npm/v/crypto-browserify.svg?style=flat-square)](https://www.npmjs.org/package/crypto-browserify) | [![](https://img.shields.io/david/crypto-browserify/crypto-browserify.svg?style=flat-square)](https://david-dm.org/crypto-browserify/crypto-browserify#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/crypto-browserify.svg?style=flat-square)](https://github.com/crypto-browserify/crypto-browserify/issues) |
| <h6><a href="https://github.com/indutny/des.js">des.js</a></h6> | [![](https://img.shields.io/npm/v/des.js.svg?style=flat-square)](https://www.npmjs.org/package/des.js) | [![](https://img.shields.io/david/indutny/des.js.svg?style=flat-square)](https://david-dm.org/indutny/des.js#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/des.js.svg?style=flat-square)](https://github.com/indutny/des.js/issues) |
| <h6><a href="https://github.com/crypto-browserify/diffie-hellman">diffie-hellman</a></h6> | [![](https://img.shields.io/npm/v/diffie-hellman.svg?style=flat-square)](https://www.npmjs.org/package/diffie-hellman) | [![](https://img.shields.io/david/crypto-browserify/diffie-hellman.svg?style=flat-square)](https://david-dm.org/crypto-browserify/diffie-hellman#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/diffie-hellman.svg?style=flat-square)](https://github.com/crypto-browserify/diffie-hellman/issues) |
| <h6><a href="https://github.com/indutny/elliptic">elliptic</a></h6> | [![](https://img.shields.io/npm/v/elliptic.svg?style=flat-square)](https://www.npmjs.org/package/elliptic) | [![](https://img.shields.io/david/indutny/elliptic.svg?style=flat-square)](https://david-dm.org/indutny/elliptic#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/elliptic.svg?style=flat-square)](https://github.com/indutny/elliptic/issues) |
| <h6><a href="https://github.com/crypto-browserify/EVP_BytesToKey">evp_bytestokey</a></h6> | [![](https://img.shields.io/npm/v/evp_bytestokey.svg?style=flat-square)](https://www.npmjs.org/package/evp_bytestokey) | [![](https://img.shields.io/david/crypto-browserify/EVP_BytesToKey.svg?style=flat-square)](https://david-dm.org/crypto-browserify/EVP_BytesToKey#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/EVP_BytesToKey.svg?style=flat-square)](https://github.com/crypto-browserify/EVP_BytesToKey/issues) |
| <h6><a href="https://github.com/indutny/hash.js">hash.js</a></h6> | [![](https://img.shields.io/npm/v/hash.js.svg?style=flat-square)](https://www.npmjs.org/package/hash.js) | [![](https://img.shields.io/david/indutny/hash.js.svg?style=flat-square)](https://david-dm.org/indutny/hash.js#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/hash.js.svg?style=flat-square)](https://github.com/indutny/hash.js/issues) |
| <h6><a href="https://github.com/isaacs/inherits">inherits</a></h6> | [![](https://img.shields.io/npm/v/inherits.svg?style=flat-square)](https://www.npmjs.org/package/inherits) | [![](https://img.shields.io/david/isaacs/inherits.svg?style=flat-square)](https://david-dm.org/isaacs/inherits#info=dependencies) | [![](https://img.shields.io/github/issues-raw/isaacs/inherits.svg?style=flat-square)](https://github.com/isaacs/inherits/issues) |
| <h6><a href="https://github.com/indutny/miller-rabin">miller-rabin</a></h6> | [![](https://img.shields.io/npm/v/miller-rabin.svg?style=flat-square)](https://www.npmjs.org/package/miller-rabin) | [![](https://img.shields.io/david/indutny/miller-rabin.svg?style=flat-square)](https://david-dm.org/indutny/miller-rabin#info=dependencies) | [![](https://img.shields.io/github/issues-raw/indutny/miller-rabin.svg?style=flat-square)](https://github.com/indutny/miller-rabin/issues) |
| <h6><a href="https://github.com/calvinmetcalf/minimalistic-assert">minimalistic-assert</a></h6> | [![](https://img.shields.io/npm/v/minimalistic-assert.svg?style=flat-square)](https://www.npmjs.org/package/minimalistic-assert) | [![](https://img.shields.io/david/calvinmetcalf/minimalistic-assert.svg?style=flat-square)](https://david-dm.org/calvinmetcalf/minimalistic-assert#info=dependencies) | [![](https://img.shields.io/github/issues-raw/calvinmetcalf/minimalistic-assert.svg?style=flat-square)](https://github.com/calvinmetcalf/minimalistic-assert/issues) |
| <h6><a href="https://github.com/crypto-browserify/parse-asn1">parse-asn1</a></h6> | [![](https://img.shields.io/npm/v/parse-asn1.svg?style=flat-square)](https://www.npmjs.org/package/parse-asn1) | [![](https://img.shields.io/david/crypto-browserify/parse-asn1.svg?style=flat-square)](https://david-dm.org/crypto-browserify/parse-asn1#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/parse-asn1.svg?style=flat-square)](https://github.com/crypto-browserify/parse-asn1/issues) |
| <h6><a href="https://github.com/crypto-browserify/pbkdf2">pbkdf2</a></h6> | [![](https://img.shields.io/npm/v/pbkdf2.svg?style=flat-square)](https://www.npmjs.org/package/pbkdf2) | [![](https://img.shields.io/david/crypto-browserify/pbkdf2.svg?style=flat-square)](https://david-dm.org/crypto-browserify/pbkdf2#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/pbkdf2.svg?style=flat-square)](https://github.com/crypto-browserify/pbkdf2/issues) |
| <h6><a href="https://github.com/crypto-browserify/publicEncrypt">public-encrypt</a></h6> | [![](https://img.shields.io/npm/v/public-encrypt.svg?style=flat-square)](https://www.npmjs.org/package/public-encrypt) | [![](https://img.shields.io/david/crypto-browserify/publicEncrypt.svg?style=flat-square)](https://david-dm.org/crypto-browserify/publicEncrypt#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/publicEncrypt.svg?style=flat-square)](https://github.com/crypto-browserify/publicEncrypt/issues) |
| <h6><a href="https://github.com/crypto-browserify/randombytes">randombytes</a></h6> | [![](https://img.shields.io/npm/v/randombytes.svg?style=flat-square)](https://www.npmjs.org/package/randombytes) | [![](https://img.shields.io/david/crypto-browserify/randombytes.svg?style=flat-square)](https://david-dm.org/crypto-browserify/randombytes#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/randombytes.svg?style=flat-square)](https://github.com/crypto-browserify/randombytes/issues) |
| <h6><a href="https://github.com/crypto-browserify/ripemd160">ripemd160</a></h6> | [![](https://img.shields.io/npm/v/ripemd160.svg?style=flat-square)](https://www.npmjs.org/package/ripemd160) | [![](https://img.shields.io/david/crypto-browserify/ripemd160.svg?style=flat-square)](https://david-dm.org/crypto-browserify/ripemd160#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/ripemd160.svg?style=flat-square)](https://github.com/crypto-browserify/ripemd160/issues) |
| <h6><a href="https://github.com/crypto-browserify/sha.js">sha.js</a></h6> | [![](https://img.shields.io/npm/v/sha.js.svg?style=flat-square)](https://www.npmjs.org/package/sha.js) | [![](https://img.shields.io/david/crypto-browserify/sha.js.svg?style=flat-square)](https://david-dm.org/crypto-browserify/sha.js#info=dependencies) | [![](https://img.shields.io/github/issues-raw/crypto-browserify/sha.js.svg?style=flat-square)](https://github.com/crypto-browserify/sha.js/issues) |
<!-- rdtree-stop -->

## License

MIT
