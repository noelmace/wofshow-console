const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');
const cssnano = require('@node-minify/cssnano');
const htmlMinifier = require('@node-minify/html-minifier');
const fs = require('fs-extra');

minify({
  compressor: gcc,
  input: './src/index.js',
  output: './build/index.js'
}).then(() => {
  console.log('>>> js minified');
})

minify({
  compressor: cssnano,
  input: './src/index.css',
  output: './build/index.css'
}).then(() => {
  console.log('>>> css minified');
});

minify({
  compressor: htmlMinifier,
  input: './src/index.html',
  output: './build/index.html',
}).then(() => {
  console.log('>>> html minified');
});

fs.copy('./src/assets', './build/assets', err => {
  if (err) return console.error(err)
  console.log('>>> assets copied')
})