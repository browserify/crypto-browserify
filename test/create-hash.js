const test = require('tape')

const algorithms = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160']
const encodings = ['hex', 'base64'] // FIXME: test binary
const vectors = require('hash-test-vectors')

testLib('createHash in crypto-browserify', require('../').createHash)
testLib('create-hash/browser', require('create-hash/browser'))

function testLib (name, createHash) {
  algorithms.forEach(function (algorithm) {
    runTest(name, createHash, algorithm)
  })
}
function runTest (name, createHash, algorithm) {
  test(name + ' test ' + algorithm + ' against test vectors', function (t) {
    run(0)
    function run (i) {
      if (i >= vectors.length) {
        return t.end()
      }
      const obj = vectors[i]

      let input = Buffer.from(obj.input, 'base64')
      let node = obj[algorithm]
      let js = createHash(algorithm).update(input).digest('hex')
      if (js !== node) {
        t.equal(js, node, algorithm + '(testVector[' + i + ']) == ' + node)
      }

      encodings.forEach(function (encoding) {
        const input = Buffer.from(obj.input, 'base64').toString(encoding)
        const node = obj[algorithm]
        const js = createHash(algorithm).update(input, encoding).digest('hex')
        if (js !== node) {
          t.equal(js, node, algorithm + '(testVector[' + i + '], ' + encoding + ') == ' + node)
        }
      })
      input = Buffer.from(obj.input, 'base64')
      node = obj[algorithm]
      const hash = createHash(algorithm)
      hash.end(input)
      js = hash.read().toString('hex')
      if (js !== node) {
        t.equal(js, node, algorithm + '(testVector[' + i + ']) == ' + node)
      }
      setTimeout(run, 0, i + 1)
    }
  })
}
