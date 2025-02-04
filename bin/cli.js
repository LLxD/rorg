#!/usr/bin/env node

const path = require('path');
const { Plop, run } = require('plop');
const argv = process.argv.slice(2);
const projectDir = process.cwd();

Plop.prepare({
  cwd: projectDir,
  configPath: path.join(__dirname, '../plopfile.js'),
  preload: argv.slice(1),
  completion: argv.includes('--completion')
}, env => Plop.execute(env, run));