const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');
const cssnano = require('@node-minify/cssnano');
const htmlMinifier = require('@node-minify/html-minifier');
const fs = require('fs-extra');

fs.remove('./build', async () => {
  const promises = [];
  promises.push(minify({
    compressor: gcc,
    input: './src/index.js',
    output: './build/index.js'
  }));
  
  promises.push(minify({
    compressor: cssnano,
    input: './src/index.css',
    output: './build/index.css'
  }));
  
  promises.push(minify({
    compressor: htmlMinifier,
    input: './src/index.html',
    output: './build/index.html',
  }));

  await Promise.all(promises);
  
  await fs.copy('./src/assets', './build/assets');

  await fs.copy('./CNAME', './build/CNAME');
})

