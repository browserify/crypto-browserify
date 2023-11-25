'use strict';

var test = require('tape');

var algorithms = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'];
var vectors = require('hash-test-vectors/hmac');

function testLib(name, createHmac) {
	algorithms.forEach(function (alg) {
		test(name + ' hmac(' + alg + ')', function (t) {
			vectors.forEach(function (input) {
				var output = createHmac(alg, new Buffer(input.key, 'hex'))
					.update(input.data, 'hex').digest();

				output = input.truncate ? output.slice(0, input.truncate) : output;
				output = output.toString('hex');
				t.equal(output, input[alg]);
			});

			t.end();
		});

		test('hmac(' + alg + ')', function (t) {
			vectors.forEach(function (input) {
				var hmac = createHmac(alg, new Buffer(input.key, 'hex'));

				hmac.end(input.data, 'hex');
				var output = hmac.read();

				output = input.truncate ? output.slice(0, input.truncate) : output;
				output = output.toString('hex');
				t.equal(output, input[alg]);
			});

			t.end();
		});
	});
}

testLib('createHmac in crypto-browserify', require('../').createHmac);
testLib('create-hmac/browser', require('create-hmac/browser'));
