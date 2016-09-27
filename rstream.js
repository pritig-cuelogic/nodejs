var crypto = require('crypto');
var fs = require('fs');
var zlib = require('zlib');

var password = new Buffer(process.env.PASS || 'password');
var decryptStream = crypto.createDecipher('aes-256-cbc', password);

var gzip = zlib.createGunzip();
var readStream = fs.createReadStream('out.gz');

readStream   // reads current file
  .pipe(gzip)  // uncompresses
  .pipe(decryptStream) // decrypts
  .pipe(process.stdout)  // writes to terminal
  .on('finish', function () {  // finished
    console.log('done');
  });