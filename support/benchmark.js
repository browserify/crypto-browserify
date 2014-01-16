var ejs = require('ejs')
  , fs = require('fs')
  , Benchmark = require('benchmark').Suite
  , crypto = require('../')
  , nodecrypto = require('crypto');
ejs.open = '{{';
ejs.close = '}}';

/*
  crypto-browserify benchmark suite
  Copyright 2014 jduncanator 
*/

var HashBenchmark = new Benchmark('Hashes');
HashBenchmark.add('MD4', function() {
  crypto.createHash('md4').update('test').digest('hex');
})
HashBenchmark.add('Node MD4', function() {
  nodecrypto.createHash('md4').update('test').digest('hex');
})

HashBenchmark.add('MD5', function() {
  crypto.createHash('md5').update('test').digest('hex');
})
HashBenchmark.add('Node MD5', function() {
  nodecrypto.createHash('md5').update('test').digest('hex');
})

HashBenchmark.add('SHA1', function() {
  crypto.createHash('sha1').update('test').digest('hex');
})
HashBenchmark.add('Node SHA1', function() {
  nodecrypto.createHash('sha1').update('test').digest('hex');
})

HashBenchmark.add('SHA224', function() {
  crypto.createHash('sha224').update('test').digest('hex');
})
HashBenchmark.add('Node SHA224', function() {
  nodecrypto.createHash('sha224').update('test').digest('hex');
})

HashBenchmark.add('SHA256', function() {
  crypto.createHash('sha256').update('test').digest('hex');
})
HashBenchmark.add('Node SHA256', function() {
  nodecrypto.createHash('sha256').update('test').digest('hex');
})

HashBenchmark.on('complete', function() {
  console.log(ejs.render(fs.readFileSync('benchmark.tpl.ejs').toString(), {results: this}));
})

HashBenchmark.run();