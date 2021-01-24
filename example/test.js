const crypto = require('crypto')
const abc = crypto.createHash('sha1').update('abc').digest('hex')
console.log(abc)
