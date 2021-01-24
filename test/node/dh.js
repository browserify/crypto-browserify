const test = require('tape')
const cryptoB = require('../../')
const crypto = require('crypto')

test('diffie-hellman mod groups', function (t) {
  [
    'modp1', 'modp2', 'modp5', 'modp14', 'modp15', 'modp16'
  ].forEach(function (mod) {
    t.test(mod, function (t) {
      t.plan(3)
      const dh1 = cryptoB.getDiffieHellman(mod)
      const p1 = dh1.getPrime().toString('hex')
      dh1.generateKeys()

      const dh2 = crypto.getDiffieHellman(mod)
      const p2 = dh2.getPrime().toString('hex')
      dh2.generateKeys()
      t.equals(p1, p2, 'equal primes')
      const pubk1 = dh1.getPublicKey()
      const pubk2 = dh2.getPublicKey()
      t.notEquals(pubk1, pubk2, 'diff public keys')
      const pub1 = dh1.computeSecret(pubk2).toString('hex')
      const pub2 = dh2.computeSecret(pubk1).toString('hex')
      t.equals(pub1, pub2, 'equal secrets')
    })
  })
})

test('diffie-hellman key lengths', function (t) {
  [
    64, 65, 192
  ].forEach(function (len) {
    t.test('' + len, function (t) {
      t.plan(3)
      const dh2 = cryptoB.createDiffieHellman(len)
      const prime2 = dh2.getPrime()
      const p2 = prime2.toString('hex')
      const dh1 = crypto.createDiffieHellman(prime2)
      const p1 = dh1.getPrime().toString('hex')
      dh1.generateKeys()
      dh2.generateKeys()
      t.equals(p1, p2, 'equal primes')
      const pubk1 = dh1.getPublicKey()
      const pubk2 = dh2.getPublicKey()
      t.notEquals(pubk1, pubk2, 'diff public keys')
      const pub1 = dh1.computeSecret(pubk2).toString('hex')
      const pub2 = dh2.computeSecret(dh1.getPublicKey()).toString('hex')
      t.equals(pub1, pub2, 'equal secrets')
    })
  })
})
