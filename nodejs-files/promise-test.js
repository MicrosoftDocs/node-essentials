
// import fs from "node:fs";
import fs from "node:fs/promises";

import path from "node:path";

// ESM & `__dirname` https://www.cnblogs.com/xgqfrms/p/16100047.html
// 默认当前 root 路径 ✅
const __dirname = path.resolve();

console.log(`✅ path =`, path.join(__dirname));
// ✅ path = /Users/xgqfrms-mm/Documents/github/node-essentials/nodejs-files


// (async () => {
//   const items = await fs.readdir("stores");
//   // console.log(`✅ items =`, items);
//   // ✅ items = [ '201', '202', '2022', '203', '204', 'file.ts' ]
//   for (const item of items) {
//     // console.log(`✅ item =`, item);
//   }
//   // ✅ item = 201
//   // ✅ item = 202
//   // ✅ item = 2022
//   // ✅ item = 203
//   // ✅ item = 204
//   // ✅ item = file.ts
// })();

(async () => {
  const options = {
    encoding: 'utf8',
    withFileTypes: true,
  };
  const files = await fs.readdir("stores", options);
  // console.log(`❌ err, files =`, err);
  console.log(`🗂️ files =`, files);
  // 🗂️ files = [
  //   Dirent { name: '201', [Symbol(type)]: 2 },
  //   Dirent { name: '202', [Symbol(type)]: 2 },
  //   Dirent { name: '2022', [Symbol(type)]: 2 },
  //   Dirent { name: '203', [Symbol(type)]: 2 },
  //   Dirent { name: '204', [Symbol(type)]: 2 },
  //   Dirent { name: 'file.ts', [Symbol(type)]: 1 }
  // ]
  for (let item of files) {
    const type = item.isDirectory() ? "folder" : "file";
    console.log(`✅ name = ${item.name}, type =${type}`);
    // ✅ name = 201, type =folder
    // ✅ name = 202, type =folder
    // ✅ name = 2022, type =folder
    // ✅ name = 203, type =folder
    // ✅ name = 204, type =folder
    // ✅ name = file.ts, type =file
  }
})();


/* 

// callback ❌

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



// ✅ promise

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