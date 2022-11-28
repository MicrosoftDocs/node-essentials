import fs from "node:fs/promises";
import path from "node:path";

async function findFiles(folderName, result) {
  let promiseFlag = Promise.resolve(true);
  const items = await fs.readdir(folderName, { withFileTypes: true });
  items.forEach(async (item) => {
    promiseFlag = Promise.resolve(true);
    console.log(`item =`, item);
    // console.log(`item.isDirectory() =`, item.isDirectory());
    // console.log(`item.isFile() =`, item.isFile());
    const name = path.extname(item.name);
    // console.log(`name =`, name);
    // console.log(`typeof name, type =`, typeof name, name === '' ? '🗂️ folder' : '🗒️ file');
    // if (name === ".json" || name === ".ts") {
    if (name !== '') {
      const path = `${folderName}/${item.name}`;
      result.push(path);
    } else {
      promiseFlag = Promise.resolve(false);
      const newFolderName = path.join(folderName, item.name);
      // 递归
      await findFiles(newFolderName, result);
      // const temp = await findFiles(newFolderName, result);
      // result = result.concat(temp);
    }
  });
  console.log(`result`, result);
  if(await promiseFlag) {
    return result;
  }
}


// const result = [];
let result = [];
await findFiles("stores", result);
console.log(`❌ result =`, result);

/* 

$ node ./index.js
item = Dirent { name: '201', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: '202', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: '2022', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: '203', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: '204', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: 'file.ts', [Symbol(type)]: 1 } false
name = .ts
❌ result = [ 'stores/file.ts' ]
item = Dirent { name: 'sales.json', [Symbol(type)]: 1 } false
name = .json
item = Dirent { name: 'sales.json', [Symbol(type)]: 1 } false
name = .json
item = Dirent { name: '11', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: 'sales.json', [Symbol(type)]: 1 } false
name = .json
item = Dirent { name: 'sales.json', [Symbol(type)]: 1 } false
name = .json
item = Dirent { name: '27', [Symbol(type)]: 2 } true
name = 
item = Dirent { name: 'sales.json', [Symbol(type)]: 1 } false
name = .json


*/