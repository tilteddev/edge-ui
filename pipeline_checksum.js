/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const modDir = __dirname;
const excl = ['manifest.json', '.git', '.project', 'pipeline_checksum.js','.settings','.gitignore','.github'];
let files = {};
let diffCount = 0;
let existingManifest = JSON.parse(fs.readFileSync('manifest.json'));

function checkSum(dirPath) {
   let dirs = fs.readdirSync(dirPath);
   dirs.forEach((file) => {
      if (!excl.includes(file)) {
         if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            checkSum(dirPath + '/' + file);
         } else {
            let sha256sum = crypto.createHash('SHA256').update(fs.readFileSync(path.join(dirPath, file))).digest('hex');
            let keyFile = dirPath == modDir ? file : dirPath.substring(dirPath.lastIndexOf('/') + 1) + '/' + file;
            files[keyFile] = sha256sum;
            if (!existingManifest.files[keyFile] || files[keyFile] != existingManifest.files[keyFile]) {
               diffCount += 1;
               console.log(`SHA256SUM of ${keyFile} will be updated  ►  ${sha256sum}`);
            }

         }
      }
   });
}

checkSum(__dirname);

if (diffCount > 0) {
   console.log('update required');
   existingManifest.files = files;
   fs.writeFileSync('manifest.json', JSON.stringify(existingManifest, null, 3));
}
