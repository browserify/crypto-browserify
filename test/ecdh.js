const mods = [
  'secp256k1',
  'secp224r1',
  'prime256v1',
  'prime192v1'
]
const test = require('tape')
const _crypto = require('../')
const createECDH1 = _crypto.createECDH
const createECDH2 = require('create-ecdh/browser')

mods.forEach(function (mod) {
  test('createECDH: ' + mod + ' uncompressed', function (t) {
    t.plan(2)
    const dh1 = createECDH1(mod)
    dh1.generateKeys()
    const dh2 = createECDH2(mod)
    dh2.generateKeys()
    const pubk1 = dh1.getPublicKey()
    const pubk2 = dh2.getPublicKey()
    t.notEquals(pubk1.toString('hex'), pubk2.toString('hex'), 'diff public keys')
    const pub1 = dh1.computeSecret(pubk2).toString('hex')
    const pub2 = dh2.computeSecret(pubk1).toString('hex')
    t.equals(pub1, pub2, 'equal secrets')
  })

  test('createECDH: ' + mod + ' compressed', function (t) {
    t.plan(2)
    const dh1 = createECDH1(mod)
    dh1.generateKeys()
    const dh2 = createECDH2(mod)
    dh2.generateKeys()
    const pubk1 = dh1.getPublicKey(null, 'compressed')
    const pubk2 = dh2.getPublicKey(null, 'compressed')
    t.notEquals(pubk1.toString('hex'), pubk2.toString('hex'), 'diff public keys')
    const pub1 = dh1.computeSecret(pubk2).toString('hex')
    const pub2 = dh2.computeSecret(pubk1).toString('hex')
    t.equals(pub1, pub2, 'equal secrets')
  })

  test('createECDH: ' + mod + ' set stuff', function (t) {
    t.plan(5)
    const dh1 = createECDH1(mod)
    const dh2 = createECDH2(mod)
    dh1.generateKeys()
    dh2.generateKeys()
    dh1.setPrivateKey(dh2.getPrivateKey())
    dh1.setPublicKey(dh2.getPublicKey())
    const priv1 = dh1.getPrivateKey('hex')
    const priv2 = dh2.getPrivateKey('hex')
    t.equals(priv1, priv2, 'same private key')
    const pubk1 = dh1.getPublicKey()
    const pubk2 = dh2.getPublicKey()
    t.equals(pubk1.toString('hex'), pubk2.toString('hex'), 'same public keys, uncompressed')
    t.equals(dh1.getPublicKey('hex', 'compressed'), dh2.getPublicKey('hex', 'compressed'), 'same public keys compressed')
    t.equals(dh1.getPublicKey('hex', 'hybrid'), dh2.getPublicKey('hex', 'hybrid'), 'same public keys hybrid')
    const pub1 = dh1.computeSecret(pubk2).toString('hex')
    const pub2 = dh2.computeSecret(pubk1).toString('hex')
    t.equals(pub1, pub2, 'equal secrets')
  })
})
