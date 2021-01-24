const test = require('tape')
const crypto = require('../')
const Buffer = require('safe-buffer').Buffer

test('get error message', function (t) {
  try {
    const b = crypto.randomFillSync(Buffer.alloc(10))
    t.ok(Buffer.isBuffer(b))
    t.end()
  } catch (err) {
    t.ok(/not supported/.test(err.message), '"not supported"  is in error message')
    t.end()
  }
})

test('randomfill', function (t) {
  t.plan(5)
  t.equal(crypto.randomFillSync(Buffer.alloc(10)).length, 10)
  t.ok(Buffer.isBuffer(crypto.randomFillSync(Buffer.alloc(10))))
  crypto.randomFill(Buffer.alloc(10), function (ex, bytes) {
    t.error(ex)
    t.equal(bytes.length, 10)
    t.ok(Buffer.isBuffer(bytes))
    t.end()
  })
})

test('seems random', function (t) {
  const L = 1000
  const b = crypto.randomFillSync(Buffer.alloc(L))

  const mean = [].reduce.call(b, function (a, b) {
    return a + b
  }, 0) / L

  // test that the random numbers are plausably random.
  // Math.random() will pass this, but this will catch
  // terrible mistakes such as this blunder:
  // https://github.com/dominictarr/crypto-browserify/commit/3267955e1df7edd1680e52aeede9a89506ed2464#commitcomment-7916835

  // this doesn't check that the bytes are in a random *order*
  // but it's better than nothing.

  const expected = 256 / 2
  const smean = Math.sqrt(mean)

  // console.log doesn't work right on testling, *grumble grumble*
  console.log(JSON.stringify([expected - smean, mean, expected + smean]))
  t.ok(mean < expected + smean)
  t.ok(mean > expected - smean)

  t.end()
})
