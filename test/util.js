var test = require('tape')
var crypto = require('crypto')
var cryptoB = require('../')


exports.same =
function assertSame(name, fn) {
    test(name, function (t) {
        t.plan(1);
        fn(crypto, function (err, expected) {
            fn(cryptoB, function (err, actual) {
                t.equal(actual, expected, name);
                t.end();
            });
        });
    });
}

