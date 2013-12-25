# crypto-browserify

A (partial) port of `crypto` to the browser.


[![travis](https://secure.travis-ci.org/jduncanator/crypto-browserify.png?branch=master)](https://travis-ci.org/jduncanator/crypto-browserify) [![Build Status](https://drone.io/github.com/jduncanator/crypto-browserify/status.png)](https://drone.io/github.com/jduncanator/crypto-browserify/latest) [![Coverage Status](https://coveralls.io/repos/jduncanator/crypto-browserify/badge.png)](https://coveralls.io/r/jduncanator/crypto-browserify) [![Node.ci](https://node.ci/report/jduncanator/crypto-browserify/master.png)]
(https://node.ci/projects/jduncanator/crypto-browserify/master)

[![browser support](https://ci.testling.com/jduncanator/crypto-browserify.png)](http://ci.testling.com/jduncanator/crypto-browserify)


Basically, I found some crypto implemented in JS lieing on the internet somewhere
and wrapped it in the part of the `crypto` api that I am currently using.

In a way that will be compatible with [browserify](https://github.com/substack/node-browserify/).

I will extend this if I need more features, or if anyone else wants to extend this,
I will add you as a maintainer.

Provided that you agree that it should replicate the [node.js/crypto](http://nodejs.org/api/crypto.html) api exactly, of course.

## TODO

### Hash Algorithms

  ~~md4~~
  ~~md5~~
  mdc2
  ripemd
  ripemd160
  rmd160
  sha
  ~~sha1~~
  ~~sha224~~
  ~~sha256~~
  sha384
  sha512
  whirlpool
