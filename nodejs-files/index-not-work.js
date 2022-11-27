// const fs = require("fs").promises;
// const path = require("path");

import fs from "node:fs/promises";
import path from "node:path";

// (async () => {
//   const items = await fs.readdir("stores");
//   console.log(`✅ items =\n`, items); 
// })();

// const items = await fs.readdir("stores", { withFileTypes: true });
// for (let item of items) {
//   const type = item.isDirectory() ? "folder" : "file";
//   console.log(`${item.name}: ${type}`);
// }

async function findFiles(folderName, result) {
  const items = await fs.readdir(folderName, { withFileTypes: true });
  async function test(items, result) {
    items.forEach((item) => {
      console.log(`item =`, item);
      if (path.extname(item.name) === ".json") {
        const path = `${folderName}/${item.name}`;
        console.log(`path`, path);
        result.push(path);
      } else {
        // this is a folder, so call this method again and pass in the path to the folder
        console.log(`🚀 findFiles`);
        // 递归
        const temp = findFiles(path.join(folderName, item.name), result);
        result.concat(temp);
      }
    });
    return result;
  }
  const temp = await test(items, result);
  console.log(`temp`, temp);
  // console.log(`result`, result);
  return result;
  // return Promise.resolve(result);
}


const result = await findFiles("stores", []);
console.log(`✅ result =`, result);
