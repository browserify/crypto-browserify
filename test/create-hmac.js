
var same = require('./util').same
var join = require('./util').join
var test = require('tape')

var algorithms = require('../').getHashes()
var vectors = require('hash-test-vectors/hmac')
var createHmac = require('../create-hmac')

algorithms.forEach(function (alg) {

  test('hmac('+alg+')', function (t) {
    vectors.forEach(function (input, i) {
      var output = createHmac(alg, new Buffer(input.key, 'hex'))
          .update(input.data, 'hex').digest()

      output = input.truncate ? output.slice(0, input.truncate) : output
      t.equal(output.toString('hex'), input[alg])
    })
    t.end()
  })

//  ;['p455w0rd', 'secretz', 'whatevs', 'such secure, wow', ''].forEach(function (pass) {
//    same('createHmac('+alg+', ' + JSON.stringify(pass) + ')' , function (crypto, cb) {
//      var r = crypto
//        .createHmac(alg, new Buffer(pass, 'ascii'))
//        .digest('hex')
//      console.log(r)
//      cb(null, r)
//    })
//  })
//
//  for(var i = 8; i < data.length; i += 7)
//    (function (i) {
//      var pass = data.slice(0, i)
//      same('createHmac('+alg+', pseudoRandomBytes('+ i + ')' , function (crypto, cb) {
//        var r = crypto
//          .createHmac(alg, pass)
//          .digest('hex')
//        console.log(r)
//        cb(null, r)
//      })
//    }(i))
//

})



