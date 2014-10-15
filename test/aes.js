var test = require('tape');

test('ciphers', function (t) {
  t.ok(require('../').listCiphers().length);
  t.end();
});