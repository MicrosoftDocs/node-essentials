
// import fs from "node:fs/promises";
import fs from "node:fs";

import path from "node:path";

// ESM & `__dirname` https://www.cnblogs.com/xgqfrms/p/16100047.html
// 默认当前 root 路径 ✅
const __dirname = path.resolve();

console.log(`✅ path =`, path.join(__dirname));
// ✅ path = /Users/xgqfrms-mm/Documents/github/node-essentials/nodejs-files


(async () => {
  const options = {
    encoding: 'utf8',
    withFileTypes: true,
  };
  const callback = (err, files) => {
    console.log(`❌ err, files =`, err);
    console.log(`🗂️ files =`,files);
  }
  fs.readdir("stores", options, callback);
  // fs.readdir("stores", options, (err, files) => callback(err, files));
})();


/* 

// ✅ callback function

fs.readdir(path[, options], callback)

path <string> | <Buffer> | <URL>
options <string> | <Object>
  encoding <string> Default: 'utf8'
  withFileTypes <boolean> Default: false
callback <Function>
  err <Error>
  files <string[]> | <Buffer[]> | <fs.Dirent[]>

https://nodejs.org/api/fs.html#fsreaddirpath-options-callback

https://man7.org/linux/man-pages/man3/readdir.3.html

https://nodejs.org/api/fs.html#class-fsdirent


// promise ❌ no callback
fsPromises.readdir(path[, options])

path <string> | <Buffer> | <URL>
options <string> | <Object>
  encoding <string> Default: 'utf8'
  withFileTypes <boolean> Default: false
Returns: <Promise> Fulfills with an array of the names of the files in the directory excluding '.' and '..'.

https://nodejs.org/api/fs.html#fspromisesreaddirpath-options




https://nodejs.org/api/fs.html#fsreaddirsyncpath-options

fs.readdirSync(path[, options])#



*/

/* 

(alias) namespace path
(alias) const path: PlatformPath
import path

(alias) module "node:fs/promises"
import fs

import { readdir } from 'fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}

*/