var BigInteger = require('cryptonum')
  , Buffer = require('buffer').Buffer;

// Diffie-Hellman Class
function DiffieHellman() {
	this.public_key = null
	this.private_key = null;
	this.p = null;
	this.q = null;
	this.g = null;
}

DiffieHellman.prototype.generateKeys = function(encoding) {
	throw new Error('Not Implemented: DiffieHellman.generateKeys');
}

DiffieHellman.prototype.computeSecret = function(other_public_key, input_encoding, output_encoding) {
	if(!(other_public_key instanceof Buffer)) throw new TypeError('Not a buffer');

	// Optional Arguments
	if(!input_encoding) input_encoding = 'buffer';
	if(!output_encoding) output_encoding = 'buffer';

	var bob_public;
	// Parse other_public_key
	switch(input_encoding) {
		case 'buffer':
			bob_public = new BigInteger(other_public_key.toString('hex'), 16);
			break;
		case 'hex':
			bob_public = new BigInteger(other_public_key, 16);
			break;
		case 'binary':
			// TODO
			throw new Error('TODO');
			break;
		case 'base64':
			bob_public = new BigInteger(other_public_key, 64);
			break;
		default:
			throw new TypeError('Unknown Encoding: ' + input_encoding);
			break;
	}
	
	if(this.private_key == null) throw new Error('Invalid key');

	// Check the public key (taken from OpenSSL)
	var q = BigInteger.ONE.clone();
	if(bob_public.compareTo(q) <= 0) throw new Error('Invalid key'); // DH_CHECK_PUBKEY_TOO_SMALL

	this.p.copyTo(q);
	q = q.subtract(BigInteger.ONE);
	if(bob_public.compareTo(q) >= 0) throw new Error('Invalid key'); // DH_CHECK_PUBKEY_TOO_LARGE

	// Calculate Key
	var ret = bob_public.modPow(this.private_key, this.p);
	var buff = new Buffer(ret.toString(16), 'hex');

	switch(output_encoding) {
		case 'buffer':
			return buff;
		case 'hex':
			return buff.toString('hex');
		case 'binary':
			return buff.toString('binary');
		case 'base64':
			return buff.toString('base64');
		default:
			throw new TypeError('Unknown Encoding: ' + input_encoding);
	}
}