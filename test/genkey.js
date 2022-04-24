var test = require('tape')
var crypto = require('../')

var rsa = {}

var msg = 'wow keygen is working'

test('generateKeyPairSync', (t) => {
	t.test('can generate', (t) => {
		t.plan(1)
		t.doesNotThrow(() => {
			crypto.generateKeyPair('rsa', {
				modulusLength: 4096,
				publicKeyEncoding: {
					type: 'spki',
					format: 'pem'
				},
				privateKeyEncoding: {
					type: 'pkcs1',
					format: 'pem'
				}
			}, (keys) => {
				rsa.private = Buffer.from(keys.privateKey)
				rsa.public = Buffer.from(keys.publicKey)
			})
		})
	})
})

// rsa.private = new Buffer(rsa.private, 'hex')
// rsa.public = new Buffer(rsa.public, 'hex')

test('publicEncrypt/privateDecrypt with generated key', function (t) {
	let encrypted;
	t.test('can encrypt with generated key', function (t) {
		t.plan(1)
		// note encryption is ranomized so can't test to see if they encrypt the same
		t.doesNotThrow(() => {
			encrypted = crypto.publicEncrypt(rsa.public, Buffer.from(msg));
		}, null, 'encrypts without throwing errors')
		t.end()
		// t.equals(crypto2.privateDecrypt(rsa.private, new Buffer(encrypted, 'hex')).toString(), 'hello there I am a nice message', 'decrypt it properly')
	})
	t.test('can decrypt with generated key', function (t) {
		t.equals(crypto.privateDecrypt(rsa.private, encrypted).toString(), msg, 'decrypts it back');
		t.end()
	})
})

test('privateEncrypt/publicDecrypt', function (t) {
	let encrypted;
	t.test('can encrypt with generated key', function (t) {
		// note encryption is ranomized so can't test to see if they encrypt the same
		t.doesNotThrow(() => {
			encrypted = crypto.privateEncrypt(rsa.private, Buffer.from(msg));
		}, null, 'encrypts without throwing errors')
		t.end()
		// t.equals(crypto2.privateDecrypt(rsa.private, new Buffer(encrypted, 'hex')).toString(), 'hello there I am a nice message', 'decrypt it properly')
	})
	t.test('can decrypt with generated key', function (t) {
		t.equals(crypto.publicDecrypt(rsa.public, encrypted).toString(), msg, 'decrypts it back');
		t.end()
	})
})
