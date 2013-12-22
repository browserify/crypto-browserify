/*
* A JavaScript implementation of the RSA Data Security, Inc. MD4 Message
* Digest Algorithm, as defined in RFC 1320.
* Version 2.1 Copyright (C) Jerrad Pierce, Paul Johnston 1999 - 2002.
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*/

var helpers = require('../helpers');

/*
* Calculate the MD4 of an array of little-endian words, and a bit length
*/
function core_md4(x, len)
{
   /* append padding */
   x[len >> 5] |= 0x80 << (len % 32);
   x[(((len + 64) >>> 9) << 4) + 14] = len;

   var a =  1732584193;
   var b = -271733879;
   var c = -1732584194;
   var d =  271733878;

   for(var i = 0; i < x.length; i += 16)
   {
     var olda = a;
     var oldb = b;
     var oldc = c;
     var oldd = d;

     a = md4_ff(a, b, c, d, x[i+ 0], 3 );
     d = md4_ff(d, a, b, c, x[i+ 1], 7 );
     c = md4_ff(c, d, a, b, x[i+ 2], 11);
     b = md4_ff(b, c, d, a, x[i+ 3], 19);
     a = md4_ff(a, b, c, d, x[i+ 4], 3 );
     d = md4_ff(d, a, b, c, x[i+ 5], 7 );
     c = md4_ff(c, d, a, b, x[i+ 6], 11);
     b = md4_ff(b, c, d, a, x[i+ 7], 19);
     a = md4_ff(a, b, c, d, x[i+ 8], 3 );
     d = md4_ff(d, a, b, c, x[i+ 9], 7 );
     c = md4_ff(c, d, a, b, x[i+10], 11);
     b = md4_ff(b, c, d, a, x[i+11], 19);
     a = md4_ff(a, b, c, d, x[i+12], 3 );
     d = md4_ff(d, a, b, c, x[i+13], 7 );
     c = md4_ff(c, d, a, b, x[i+14], 11);
     b = md4_ff(b, c, d, a, x[i+15], 19);

     a = md4_gg(a, b, c, d, x[i+ 0], 3 );
     d = md4_gg(d, a, b, c, x[i+ 4], 5 );
     c = md4_gg(c, d, a, b, x[i+ 8], 9 );
     b = md4_gg(b, c, d, a, x[i+12], 13);
     a = md4_gg(a, b, c, d, x[i+ 1], 3 );
     d = md4_gg(d, a, b, c, x[i+ 5], 5 );
     c = md4_gg(c, d, a, b, x[i+ 9], 9 );
     b = md4_gg(b, c, d, a, x[i+13], 13);
     a = md4_gg(a, b, c, d, x[i+ 2], 3 );
     d = md4_gg(d, a, b, c, x[i+ 6], 5 );
     c = md4_gg(c, d, a, b, x[i+10], 9 );
     b = md4_gg(b, c, d, a, x[i+14], 13);
     a = md4_gg(a, b, c, d, x[i+ 3], 3 );
     d = md4_gg(d, a, b, c, x[i+ 7], 5 );
     c = md4_gg(c, d, a, b, x[i+11], 9 );
     b = md4_gg(b, c, d, a, x[i+15], 13);

     a = md4_hh(a, b, c, d, x[i+ 0], 3 );
     d = md4_hh(d, a, b, c, x[i+ 8], 9 );
     c = md4_hh(c, d, a, b, x[i+ 4], 11);
     b = md4_hh(b, c, d, a, x[i+12], 15);
     a = md4_hh(a, b, c, d, x[i+ 2], 3 );
     d = md4_hh(d, a, b, c, x[i+10], 9 );
     c = md4_hh(c, d, a, b, x[i+ 6], 11);
     b = md4_hh(b, c, d, a, x[i+14], 15);
     a = md4_hh(a, b, c, d, x[i+ 1], 3 );
     d = md4_hh(d, a, b, c, x[i+ 9], 9 );
     c = md4_hh(c, d, a, b, x[i+ 5], 11);
     b = md4_hh(b, c, d, a, x[i+13], 15);
     a = md4_hh(a, b, c, d, x[i+ 3], 3 );
     d = md4_hh(d, a, b, c, x[i+11], 9 );
     c = md4_hh(c, d, a, b, x[i+ 7], 11);
     b = md4_hh(b, c, d, a, x[i+15], 15);

     a = safe_add(a, olda);
     b = safe_add(b, oldb);
     c = safe_add(c, oldc);
     d = safe_add(d, oldd);

   }
   return Array(a, b, c, d);

}

/*
* These functions implement the basic operation for each round of the
* algorithm.
*/
function md4_cmn(q, a, b, x, s, t)
{
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md4_ff(a, b, c, d, x, s)
{
  return md4_cmn((b & c) | ((~b) & d), a, 0, x, s, 0);
}
function md4_gg(a, b, c, d, x, s)
{
  return md4_cmn((b & c) | (b & d) | (c & d), a, 0, x, s, 1518500249);
}
function md4_hh(a, b, c, d, x, s)
{
  return md4_cmn(b ^ c ^ d, a, 0, x, s, 1859775393);
}

/*
* Add integers, wrapping at 2^32. This uses 16-bit operations internally
* to work around bugs in some JS interpreters.
*/
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
* Bitwise rotate a 32-bit number to the left.
*/
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md4(buf) {
  return helpers.hash(buf, core_md4, 16);
};
