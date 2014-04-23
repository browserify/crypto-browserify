
var tape = require('tape')
var pbkdf2 = require('../').pbkdf2
var crypto = require('crypto')

tape('pbkdf2', function (t) {
  pbkdf2('hello', 'salt', 1000, 20, function (err, key) {
    if(err) throw err
    t.deepEqual(key.toString('hex'), crypto.pbkdf2Sync('hello', 'salt', 1000, 20).toString('hex'))
    t.end()
  })
})
