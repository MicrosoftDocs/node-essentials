// import { json } from 'stream/consumers';

const fs = require('fs').promises;
const path = require('path');

// console.log(`cjs`);

async function calculateSalesFiles(files) {
  let result = 0;
  for (const file of files) {
    const jsonString = await fs.readFile(file);
    const obj = JSON.parse(jsonString);
    result += obj.total;
  }
  return result;
}

// async function findSalesFiles(folderName) {
//   let files = [];
//   const items = await fs.readdir(folderName, { withFileTypes: true });
//   for (const item of items) {
//     if(item.isDirectory()) {
//       const newFolderName = path.join(folderName, item.name)
//       const temp = await findSalesFiles(newFolderName);
//       // 拼接
//       files = files.concat(temp);
//     } else {
//       if(path.extname(item.name) === '.json') {
//         const file = path.join(folderName, item.name)
//         files.push(file);
//       }
//     }
//   }
//   return files;
// }

async function findSalesFiles(folderName, arr = []) {
  let files = arr ?? [];
  const items = await fs.readdir(folderName, { withFileTypes: true });
  for (const item of items) {
    if(item.isDirectory()) {
      const newFolderName = path.join(folderName, item.name)
      await findSalesFiles(newFolderName, files);
    } else {
      if(path.extname(item.name) === '.json') {
        const file = path.join(folderName, item.name)
        files.push(file);
      }
    }
  }
  return files;
}

async function main() {
  const salesDir = path.join(__dirname, 'stores');
  const salesTotalsDir = path.join(__dirname, 'salesTotals');
  try {
    await fs.mkdir(salesTotalsDir);
    console.log(`✅ create folder`);
  } catch (error) {
    console.log(`❌ folder already exist`, error);
    // ❌ folder already exist [Error: EEXIST: file already exists, mkdir '/Users/xgqfrms-mm/Documents/github/node-essentials/test/salesTotals'] {
    //   errno: -17,
    //   code: 'EEXIST',
    //   syscall: 'mkdir',
    //   path: '/Users/xgqfrms-mm/Documents/github/node-essentials/test/salesTotals'
    // }
  }
  const salesFiles = await findSalesFiles(salesDir);
  console.log(`salesFiles =`, salesFiles);
  const salesTotal = await calculateSalesFiles(salesFiles);
  const report = {
    salesTotal,
    // totalStores: salesFiles.length,
    files: salesFiles.length,
  };
  const reportPath = path.join(salesTotalsDir, 'report.json');
  try {
    await fs.unlink(reportPath);
  } catch (error) {
    console.log(`❌ delete file error`, error);
    // ❌ delete file error [Error: ENOENT: no such file or directory, unlink '/Users/xgqfrms-mm/Documents/github/node-essentials/test/salesTotals/report.json'] {
    //   errno: -2,
    //   code: 'ENOENT',
    //   syscall: 'unlink',
    //   path: '/Users/xgqfrms-mm/Documents/github/node-essentials/test/salesTotals/report.json'
    // }
  }
  await fs.writeFile(reportPath, JSON.stringify(report, null, 4));
  console.log(`write finished 🚀`);
}

main();


/* 

$ node ./index.cjs
❌ folder already exist [Error: EEXIST: file already exists, mkdir '/Users/xgqfrms-mm/Documents/github/node-essentials/test/salesTotals'] {
  errno: -17,
  code: 'EEXIST',
  syscall: 'mkdir',
  path: '/Users/xgqfrms-mm/Documents/github/node-essentials/test/salesTotals'
}
salesFiles = [
  '/Users/xgqfrms-mm/Documents/github/node-essentials/test/stores/201/sales.json',
  '/Users/xgqfrms-mm/Documents/github/node-essentials/test/stores/202/sales.json',
  '/Users/xgqfrms-mm/Documents/github/node-essentials/test/stores/2022/11/11/markdown.json',
  '/Users/xgqfrms-mm/Documents/github/node-essentials/test/stores/203/sales.json',
  '/Users/xgqfrms-mm/Documents/github/node-essentials/test/stores/204/sales.json',
  '/Users/xgqfrms-mm/Documents/github/node-essentials/test/stores/bug.json'
]
write finished 🚀

*/

/* 

function unlink(path: PathLike): Promise<void>
If path refers to a symbolic link, then the link is removed without affecting the file or directory to which that link refers. If the path refers to a file path that is not a symbolic link, the file is deleted. See the POSIX unlink(2) documentation for more detail.

@since — v10.0.0

@return — Fulfills with undefined upon success.

*/
