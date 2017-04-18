'use strict'
var fs = require('fs')
var execSync = require('child_process').execSync
var path = require('path')

var pathPackageJSON = path.join(__dirname, '..', 'package.json')
var pathReadme = path.join(__dirname, '..', 'README.md')

var stdout = execSync(`npm-rdtree-markdown ${pathPackageJSON} -s`)
var readme = fs.readFileSync(pathReadme)
var readmeNew = readme.toString().replace(
  /<!-- rdtree-start -->([\s\S]*)<!-- rdtree-stop -->/mg,
  `<!-- rdtree-start -->\n${stdout.toString()}<!-- rdtree-stop -->`)

fs.writeFileSync(pathReadme, readmeNew, 'utf-8')
