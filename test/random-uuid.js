var test = require('tape')
var crypto = require('../')

test('randomuuid', function (t) {
  var uuid1 = crypto.randomUUID()
  var uuid2 = crypto.randomUUID()

  t.ok(uuid1, 'first uuid truthy')
  t.ok(uuid2, 'second uuid truthy')

  t.notEqual(uuid1, uuid2, 'consecutive uuid\'s do not match')

  t.match(uuid1, /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, 'first uuid matches uuid regex')
  t.match(uuid2, /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, 'second uuid matches uuid regex')

  t.end()
})
