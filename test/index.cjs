// import { json } from 'stream/consumers';

const fs = require('fs').promises;
const path = require('path');

console.log(`cjs`)

// async function calculateSalesFiles(files) {
//   let result = 0;
//   for (const file of files) {
//     const jsonString = fs.readFile(file);
//     const obj = JSON.parse(jsonString);
//     result += obj.total;
//   }
//   return result;
// }

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
  // const salesTotalsDir = path.join(__dirname, 'salesTotals');
  // try {
  //   await fs.mkdir(salesTotalsDir);
  //   console.log(`✅ create folder`);
  // } catch (error) {
  //   console.log(`❌ folder already exist`, error);
  // }
  const salesFiles = await findSalesFiles(salesDir);
  console.log(`salesFiles =`, salesFiles);
  // const salesTotal = await calculateSalesFiles(salesFiles);
  // const report = {
  //   salesTotal,
  //   // totalStores: salesFiles.length,
  //   files: salesFiles.length,
  // };
  // const reportPath = path.join(salesTotalsDir, 'report.json');
  // try {
  //   await fs.unlink(reportPath);
  // } catch (error) {
  //   console.log(`❌ delete file error`, error);
  // }
  // await fs.writeFile(reportPath, JSON.stringify(report, null, 4));
  // console.log(`write finished 🚀`);
}

main();


/* 

function unlink(path: PathLike): Promise<void>
If path refers to a symbolic link, then the link is removed without affecting the file or directory to which that link refers. If the path refers to a file path that is not a symbolic link, the file is deleted. See the POSIX unlink(2) documentation for more detail.

@since — v10.0.0

@return — Fulfills with undefined upon success.

*/