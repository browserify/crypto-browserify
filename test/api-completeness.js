var test = require('tape')
var browserifyCrypto = require('../')
var nodeCrypto = require('crypto');

test('browserify-crypto has all of the node-crypto api', function (t) {

  for (var name in nodeCrypto) {
    if (nodeCrypto.hasOwnProperty(name) && name[0] !== '_') {
      t.ok(browserifyCrypto.hasOwnProperty(name), ' browserify-crypto has node-crypto api ' + name)
      t.ok(typeof browserifyCrypto[name] === typeof nodeCrypto[name], ' browserify-crypto.' + name + ' is the same type as node-crypto.' + name);
    }
  }  
  t.end()
})


// Node 0.11.x has functions which 0.10.x does not
// test('node-crypto has all of the browserify-crypto api', function (t) {

//   for (var name in browserifyCrypto) {
//     if (browserifyCrypto.hasOwnProperty(name)) {
//       t.ok(nodeCrypto.hasOwnProperty(name), '' + name + ' is not extra interface')
//     }
//   }  
//   t.end();
// })


