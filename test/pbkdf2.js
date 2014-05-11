
var tape = require('tape')
var pbkdf2Sync = require('../').pbkdf2Sync

var vectors = require('hash-test-vectors/pbkdf2')

tape('pbkdf2', function (t) {
  vectors.forEach(function (input) {
    var key = pbkdf2Sync(input.password, input.salt, input.iterations, input.length)

    if(key.toString('hex') !== input.sha1)
      console.log(input)

    t.equal(key.toString('hex'), input.sha1)


  })

  t.end()
})
