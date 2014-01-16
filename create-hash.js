var createHash = require('sha.js')
var algs = {
  md5    : toConstructor(require('./md5'))
}

function toConstructor (fn) {
  return function () {
    var buffers = []
    var m= {
      update: function (data, enc) {
        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
        buffers.push(data)
        return this
      },
      digest: function (enc) {
        var buf = Buffer.concat(buffers)
        var r = fn(buf)
        buffers = null
        return enc ? r.toString(enc) : r
      }
    }
    return m
  }
}

var pool = {
  sha1: [],
  sha256: []
}

module.exports = function (alg) {
  if(algs[alg]) return new algs[alg]()
  return createHash(alg)
}
