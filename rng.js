(function() {
  module.exports = function(size) {
    if ('undefined' === typeof window) {
      return require('cry' + 'pto').randomBytes(size)
    }

    /* This will not work in older browsers.
      * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
      */
    var crypto = window.crypto || window.msCrypto

    if (!crypto)
      throw new Error('window.crypto is not supported by your browser')

    // in browserify, this is an extended Uint8Array
    var bytes = new Buffer(size)

    crypto.getRandomValues(bytes)

    return bytes
  }
}())
