var test = require('tape')
var timingSafeEqual = require('timing-safe-equal/browser')
var Buffer = require('safe-buffer').Buffer
test('timingSafeEqual', function (t) {
  t.plan(5)
  t.strictEqual(
    timingSafeEqual(Buffer.from('foo'), Buffer.from('foo')),
    true,
    'should consider equal strings to be equal'
  )

  t.strictEqual(
    timingSafeEqual(Buffer.from('foo'), Buffer.from('bar')),
    false,
    'should consider unequal strings to be unequal'
  )

  t.throws(function () {
    timingSafeEqual(Buffer.from([1, 2, 3]), Buffer.from([1, 2]))
  }, 'should throw when given buffers with different lengths')

  t.throws(function () {
    timingSafeEqual('not a buffer', Buffer.from([1, 2]))
  }, 'should throw if the first argument is not a buffer')

  t.throws(function () {
    timingSafeEqual(Buffer.from([1, 2]), 'not a buffer')
  }, 'should throw if the second argument is not a buffer')
})
