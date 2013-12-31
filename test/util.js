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

//iterate over a cartesian join
exports.join = join

function join (args, each) {
  args = args.slice()
    var first = args.shift()
  if(args.length) {
    first.forEach(function (v) {
      join(args, function (vargs) {
        each([v].concat(vargs))
      })
    })
  }
  else
    first.forEach(function (v) {
      each([v])
    })
}


if(!module.parent) {
  join([[1,2,3], ['a', 'b', 'c'], [true, false, null]], console.log)
}
