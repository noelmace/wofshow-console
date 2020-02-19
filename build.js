const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');
const cssnano = require('@node-minify/cssnano');
const htmlMinifier = require('@node-minify/html-minifier');
const fs = require('fs-extra');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const args = process.argv.slice(2);

(async () => {
  const promises = new Map([]);

  promises.set('image', imagemin(['./src/assets/img/*.{jpg,png}'], {
    // @ts-ignore
    destination: './src/assets/img',
    plugins: [imageminWebp()],
  }));

  if (args[0] === '--img-only') {
    const rslt = await promises.get('image');
    console.log(`${rslt.length} images minified`);
    return;
  }

  await fs.remove('./build');

  console.log('✓ destination folder cleaned');


  promises.set('js', minify({
    compressor: gcc,
    input: './src/index.js',
    output: './build/index.js'
  }));
  
  promises.set('css', minify({
    compressor: cssnano,
    input: './src/index.css',
    output: './build/index.css'
  }));
  
  promises.set('html', minify({
    compressor: htmlMinifier,
    input: './src/index.html',
    output: './build/index.html',
  }));

  promises.set('image', imagemin(['./src/assets/img/*.{jpg,png}'], {
    // @ts-ignore
    destination: './src/assets/img',
    plugins: [imageminWebp()],
  }));

  await Promise.all([...promises].map(async ([key, promise]) => {
    const rslt = await promise;
    console.log(`${key === 'image' ? rslt.length : '✓'} ${key} files minified`);
  }));
  
  await fs.copy('./src/assets', './build/assets');

  console.log('✓ assets copied');

  console.log('✓ custom domain name set');
})();

