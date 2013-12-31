
var same = require('./util').same
var join = require('./util').join
var test = require('tape')

;['sha1', 'sha256', 'md5'].forEach(function (alg) {
  console.log('alg', alg)
  ;['p455w0rd', 'secretz', 'whatevs', 'such secure, wow', ''].forEach(function (pass) {
    same('createHmac('+alg+', ' + JSON.stringify(pass) + ')' , function (crypto, cb) {
      var r = crypto
        .createHmac(alg, new Buffer(pass, 'ascii'))
        .digest('hex')
      console.log(r)
      cb(null, r)
    })
  })
})

