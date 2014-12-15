var test = require('tape')
var browserifyCrypto = require('../')
var nodeCrypto = require('crypto');

test('browserify-crypto has all of the node-crypto api', function (t) {

  for (var name in nodeCrypto) {
    if (nodeCrypto.hasOwnProperty(name)) {
      t.ok(browserifyCrypto.hasOwnProperty(name), ' browserify-crypto has node-crypto api function ' + name)
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


