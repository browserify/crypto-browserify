// JavaScript PBKDF2 Implementation
// Based on http://git.io/qsv2zw
// Licensed under LGPL v3
// Copyright (c) 2013 jduncanator

var Buffer = require('buffer').Buffer
  , SHA1 = require('./sha');

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

function hash(key) {
  var bufs = []
  var length = 0
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(SHA1, key, buf) : SHA1(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

exports.pbkdf2 = function(password, salt, iterations, keylen, callback) {
	if('function' !== typeof callback)
		throw new Error('No callback provided to pbkdf2');

}

exports.pbkdf2Sync = function(password, salt, iterations, keylen) {
	if('number' !== typeof iterations)
		throw new TypeError('Iterations not a number')
	if(iterations < 0)
		throw new TypeError('Bad iterations')
	if('number' !== typeof keylen)
		throw new TypeError('Key length not a number')
	if(keylen < 0)
		throw new TypeError('Bad key length')

	var HMAC;
	var cplen, p = 0, i = 1, itmp = new Array(4), digtmp;
	var out = new Buffer(keylen);
	out.fill(0);
	while(keylen) {
		if(keylen > 20)
			cplen = 20;
		else
			cplen = keylen;

		/* We are unlikely to ever use more than 256 blocks (5120 bits!)
	     * but just in case...
	     */
	    itmp[0] = (i >> 24) & 0xff;
	    itmp[1] = (i >> 16) & 0xff;
        itmp[2] = (i >> 8) & 0xff;
        itmp[3] = i & 0xff;

        HMAC = hash(password);
        HMAC.update(salt)
        HMAC.update(itmp);
    	digtmp = HMAC.digest();
    	digtmp.copy(out, p, 0, cplen);

    	for(var j = 1; j < iterations; j++) {
    		HMAC = hash(password);
    		HMAC.update(digtmp);
    		digtmp = HMAC.digest();
    		for(var k = 0; k < cplen; k++) {
    			out[k] ^= digtmp[k];
    		}
    	}
		keylen -= cplen;
		i++;
		p += cplen;
	}

	return out;
}