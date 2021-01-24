const require = function (file, cwd) {
  const resolved = require.resolve(file, cwd || '/')
  const mod = require.modules[resolved]
  if (!mod) {
    throw new Error(
      'Failed to resolve module ' + file + ', tried ' + resolved
    )
  }
  const res = mod._cached ? mod._cached : mod()
  return res
}

require.paths = []
require.modules = {}
require.extensions = ['.js', '.coffee']

require._core = {
  assert: true,
  events: true,
  fs: true,
  path: true,
  vm: true
}

require.resolve = function () {
  return function (x, cwd) {
    if (!cwd) {
      cwd = '/'
    }

    if (require._core[x]) {
      return x
    }

    const path = require.modules.path()
    cwd = path.resolve('/', cwd)
    const y = cwd || '/'

    if (x.match(/^(?:\.\.?\/|\/)/)) {
      const m = loadAsFileSync(path.resolve(y, x)) || loadAsDirectorySync(path.resolve(y, x))
      if (m) {
        return m
      }
    }

    const n = loadNodeModulesSync(x, y)
    if (n) {
      return n
    }

    throw new Error("Cannot find module '" + x + "'")

    function loadAsFileSync (x) {
      if (require.modules[x]) {
        return x
      }

      for (let i = 0; i < require.extensions.length; i++) {
        const ext = require.extensions[i]
        if (require.modules[x + ext]) {
          return x + ext
        }
      }
    }

    function loadAsDirectorySync (x) {
      x = x.replace(/\/+$/, '')
      const pkgfile = x + '/package.json'
      if (require.modules[pkgfile]) {
        const pkg = require.modules[pkgfile]()
        const b = pkg.browserify
        if (typeof b === 'object' && b.main) {
          const m = loadAsFileSync(path.resolve(x, b.main))
          if (m) {
            return m
          }
        } else if (typeof b === 'string') {
          const m = loadAsFileSync(path.resolve(x, b))
          if (m) {
            return m
          }
        } else if (pkg.main) {
          const m = loadAsFileSync(path.resolve(x, pkg.main))
          if (m) {
            return m
          }
        }
      }

      return loadAsFileSync(x + '/index')
    }

    function loadNodeModulesSync (x, start) {
      const dirs = nodeModulesPathsSync(start)
      for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i]
        const m = loadAsFileSync(dir + '/' + x)
        if (m) {
          return m
        }
        const n = loadAsDirectorySync(dir + '/' + x)
        if (n) {
          return n
        }
      }

      const m = loadAsFileSync(x)
      if (m) {
        return m
      }
    }

    function nodeModulesPathsSync (start) {
      let parts
      if (start === '/') {
        parts = ['']
      } else {
        parts = path.normalize(start).split('/')
      }

      const dirs = []
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'node_modules') {
          continue
        }
        const dir = parts.slice(0, i + 1).join('/') + '/node_modules'
        dirs.push(dir)
      }

      return dirs
    }
  }
}

require.alias = function (from, to) {
  const path = require.modules.path()
  let res = null
  try {
    res = require.resolve(from + '/package.json', '/')
  } catch (err) {
    res = require.resolve(from, '/')
  }
  const basedir = path.dirname(res)

  const keys = (Object.keys || function (obj) {
    const res = []
    for (const key in obj) {
      res.push(key)
    }
    return res
  })(require.modules)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key.slice(0, basedir.length + 1) === basedir + '/') {
      const f = key.slice(basedir.length)
      require.modules[to + f] = require.modules[basedir + f]
    } else if (key === basedir) {
      require.modules[to] = require.modules[basedir]
    }
  }
}

require.define = function (filename, fn) {
  const dirname = require._core[filename] ? '' : require.modules.path().dirname(filename)

  const require_ = function (file) {
    return require(file, dirname)
  }
  require_.resolve = function (name) {
    return require.resolve(name, dirname)
  }
  require_.modules = require.modules
  require_.define = require.define
  const module_ = { exports: {} }

  require.modules[filename] = function () {
    require.modules[filename]._cached = module_.exports
    fn.call(
      module_.exports,
      require_,
      module_,
      module_.exports,
      dirname,
      filename
    )
    require.modules[filename]._cached = module_.exports
    return module_.exports
  }
}

if (!process.nextTick) {
  process.nextTick = function () {
    const queue = []
    const canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener

    if (canPost) {
      window.addEventListener('message', function (ev) {
        if (ev.source === window && ev.data === 'browserify-tick') {
          ev.stopPropagation()
          if (queue.length > 0) {
            const fn = queue.shift()
            fn()
          }
        }
      }, true)
    }

    return function (fn) {
      if (canPost) {
        queue.push(fn)
        window.postMessage('browserify-tick', '*')
      } else {
        setTimeout(fn, 0)
      }
    }
  }
}

if (!process.title) {
  process.title = 'browser'
}

// TODO: port this code snippet to node 10+
// FIXME: internalBinding doesn't work so this may need a separate module somehow
// if (!process.binding) {
//   process.binding = function (name) {
//     if (name === 'evals') {
//       return require('vm')
//     } else {
//       throw new Error('No such module')
//     }
//   }
// }

if (!process.cwd) {
  process.cwd = function () {
    return '.'
  }
}

if (!process.env) {
  process.env = {}
}

if (!process.argv) {
  process.argv = []
}

require.define('path', function (require, module, exports, __dirname, __filename) {
  function filter (xs, fn) {
    const res = []
    for (let i = 0; i < xs.length; i++) {
      if (fn(xs[i], i, xs)) {
        res.push(xs[i])
      }
    }
    return res
  }

  // resolves . and .. elements in a path array with directory names there
  // must be no slashes, empty elements, or device names (c:\) in the array
  // (so also no leading and trailing slashes - it does not distinguish
  // relative and absolute paths)
  function normalizeArray (parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    let up = 0
    for (let i = parts.length; i >= 0; i--) {
      const last = parts[i]
      if (last === '.') {
        parts.splice(i, 1)
      } else if (last === '..') {
        parts.splice(i, 1)
        up++
      } else if (up) {
        parts.splice(i, 1)
        up--
      }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift('..')
      }
    }

    return parts
  }

  // Regex to split a filename into [*, dir, basename, ext]
  // posix version
  const splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/

  // path.resolve([from ...], to)
  // posix version
  exports.resolve = function () {
    let resolvedPath = ''
    let resolvedAbsolute = false

    for (let i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
      const path = (i >= 0) ? arguments[i] : process.cwd()

      // Skip empty and invalid entries
      if (typeof path !== 'string' || !path) {
        continue
      }

      resolvedPath = path + '/' + resolvedPath
      resolvedAbsolute = path.charAt(0) === '/'
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
      return !!p
    }), !resolvedAbsolute).join('/')

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.'
  }

  // path.normalize(path)
  // posix version
  exports.normalize = function (path) {
    const isAbsolute = path.charAt(0) === '/'
    const trailingSlash = path.slice(-1) === '/'

    // Normalize the path
    path = normalizeArray(filter(path.split('/'), function (p) {
      return !!p
    }), !isAbsolute).join('/')

    if (!path && !isAbsolute) {
      path = '.'
    }
    if (path && trailingSlash) {
      path += '/'
    }

    return (isAbsolute ? '/' : '') + path
  }

  // posix version
  exports.join = function () {
    const paths = Array.prototype.slice.call(arguments, 0)
    return exports.normalize(filter(paths, function (p, index) {
      return p && typeof p === 'string'
    }).join('/'))
  }

  exports.dirname = function (path) {
    const dir = splitPathRe.exec(path)[1] || ''
    const isWindows = false
    if (!dir) {
      // No dirname
      return '.'
    } else if (dir.length === 1 ||
        (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
      // It is just a slash or a drive letter with a slash
      return dir
    } else {
      // It is a full dirname, strip trailing slash
      return dir.substring(0, dir.length - 1)
    }
  }

  exports.basename = function (path, ext) {
    let f = splitPathRe.exec(path)[2] || ''
    // TODO: make this comparison case-insensitive on windows?
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length)
    }
    return f
  }

  exports.extname = function (path) {
    return splitPathRe.exec(path)[3] || ''
  }
})

require.define('crypto', function (require, module, exports, __dirname, __filename) {
  module.exports = require('crypto-browserify')
})

require.define('/node_modules/crypto-browserify/package.json', function (require, module, exports, __dirname, __filename) {
  module.exports = {}
})

require.define('/node_modules/crypto-browserify/index.js', function (require, module, exports, __dirname, __filename) {
  const sha = require('./sha')

  const algorithms = {
    sha1: {
      hex: sha.hex_sha1,
      binary: sha.b64_sha1,
      ascii: sha.str_sha1
    }
  }

  function error () {
    const m = [].slice.call(arguments).join(' ')
    throw new Error([
      m,
      'we accept pull requests',
      'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
  }

  exports.createHash = function (alg) {
    alg = alg || 'sha1'
    if (!algorithms[alg]) {
      error('algorithm:', alg, 'is not yet supported')
    }
    let s = ''
    const _alg = algorithms[alg]
    return {
      update: function (data) {
        s += data
        return this
      },
      digest: function (enc) {
        enc = enc || 'binary'
        let fn
        if (!(fn = _alg[enc])) {
          error('encoding:', enc, 'is not yet supported for algorithm', alg)
        }
        const r = fn(s)
        s = null // not meant to use the hash after you've called digest.
        return r
      }
    }
  };
  // the least I can do is make error messages for the rest of the node.js/crypto api.
  ['createCredentials'].forEach(function (name) {
    exports[name] = function () {
      error('sorry,', name, 'is not implemented yet')
    }
  })
})

require.define('/node_modules/crypto-browserify/sha.js', function (require, module, exports, __dirname, __filename) {
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

  exports.hexSHA1 = hexSHA1
  exports.b64SHA1 = b64SHA1
  exports.strSHA1 = strSHA1
  exports.hexHMACSHA1 = hexHMACSHA1
  exports.b64HMACSHA1 = b64HMACSHA1
  exports.strHMACSHA1 = strHMACSHA1
  exports.hexSHA1test = hexSHA1test
  exports.SHA1vmtest = SHA1vmtest

  /*
   * Configurable variables. You may need to tweak these to be compatible with
   * the server-side, but the defaults work in most cases.
   */
  const hexcase = 0 /* hex output format. 0 - lowercase; 1 - uppercase */
  const b64pad = '' /* base-64 pad character. "=" for strict RFC compliance */
  const chrsz = 8 /* bits per input character. 8 - ASCII; 16 - Unicode */

  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
  */

  function hexSHA1 (s) {
    return binb2hex(coreSHA1(str2binb(s), s.length * chrsz))
  }
  function b64SHA1 (s) {
    return binb2b64(coreSHA1(str2binb(s), s.length * chrsz))
  }
  function strSHA1 (s) {
    return binb2str(coreSHA1(str2binb(s), s.length * chrsz))
  }
  function hexHMACSHA1 (key, data) {
    return binb2hex(coreHMACSHA1(key, data))
  }
  function b64HMACSHA1 (key, data) {
    return binb2b64(coreHMACSHA1(key, data))
  }
  function strHMACSHA1 (key, data) {
    return binb2str(coreHMACSHA1(key, data))
  }

  /*
   * Perform a simple self-test to see if the VM is working
   */
  function SHA1vmtest () {
    return hexSHA1('abc') === 'a9993e364706816aba3e25717850c26c9cd0d89d'
  }

  /*
  * Compare the hex hash function to the self-test to see if
  * the result changes between uses
  * handy for catching logic errors
  */
  function hexSHA1test (s) {
    if (binb2hex(coreSHA1(str2binb('abc'), s.length * chrsz)) === SHA1vmtest()) {
      return true
    } else {
      return false
    }
  }

  /*
   * Calculate the SHA-1 of an array of big-endian words, and a bit length
   */
  function coreSHA1 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32)
    x[((len + 64 >> 9) << 4) + 15] = len

    const w = [80]
    let a = 1732584193
    let b = -271733879
    let c = -1732584194
    let d = 271733878
    let e = -1009589776

    for (let i = 0; i < x.length; i += 16) {
      const olda = a
      const oldb = b
      const oldc = c
      const oldd = d
      const olde = e

      for (let j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = x[i + j]
        } else {
          w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
        }
        const t = safeAdd(safeAdd(rol(a, 5), SHA1ft(j, b, c, d)), safeAdd(safeAdd(e, w[j]), SHA1kt(j)))
        e = d
        d = c
        c = rol(b, 30)
        b = a
        a = t
      }

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
      e = safeAdd(e, olde)
    }
    return [a, b, c, d, e]
  }

  /*
   * Perform the appropriate triplet combination function for the current
   * iteration
   */
  function SHA1ft (t, b, c, d) {
    if (t < 20) {
      return (b & c) | ((~b) & d)
    } else if (t < 40) {
      return b ^ c ^ d
    } else if (t < 60) {
      return (b & c) | (b & d) | (c & d)
    }
    return b ^ c ^ d
  }

  /*
   * Determine the appropriate additive constant for the current iteration
   */
  function SHA1kt (t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
  }

  /*
   * Calculate the HMAC-SHA1 of a key and some data
   */
  function coreHMACSHA1 (key, data) {
    let bkey = str2binb(key)
    if (bkey.length > 16) bkey = coreSHA1(bkey, key.length * chrsz)

    const ipad = [16]
    const opad = [16]
    for (let i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }

    const hash = coreSHA1(ipad.concat(str2binb(data)), 512 + data.length * chrsz)
    return coreSHA1(opad.concat(hash), 512 + 160)
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safeAdd (x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function rol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
   * Convert an 8-bit or 16-bit string to an array of big-endian words
   * In 8-bit function, characters >255 have their hi-byte silently ignored.
   */
  function str2binb (str) {
    const bin = []
    const mask = (1 << chrsz) - 1
    for (let i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32)
    }
    return bin
  }

  /*
   * Convert an array of big-endian words to a string
   */
  function binb2str (bin) {
    let str = ''
    const mask = (1 << chrsz) - 1
    for (let i = 0; i < bin.length * 32; i += chrsz) {
      str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask)
    }
    return str
  }

  /*
   * Convert an array of big-endian words to a hex string.
   */
  function binb2hex (binarray) {
    const hexTab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef'
    let str = ''
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
    }
    return str
  }

  /*
   * Convert an array of big-endian words to a base-64 string
   */
  function binb2b64 (binarray) {
    const tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let str = ''
    for (let i = 0; i < binarray.length * 4; i += 3) {
      const triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) |
      (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) |
      ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF)
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) {
          str += b64pad
        } else {
          str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
        }
      }
    }
    return str
  }
})

require.define('/test.js', function (require, module, exports, __dirname, __filename) {
  const crypto = require('crypto')
  const abc = crypto.createHash('sha1').update('abc').digest('hex')
  console.log(abc)
})

require('test.js')
