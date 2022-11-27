// const fs = require("fs").promises;
// const path = require("path");

import fs from "node:fs/promises";
import path from "node:path";

(async () => {
  const items = await fs.readdir("stores");
  console.log(`✅ items =\n`, items); 
})();

const items = await fs.readdir("stores", { withFileTypes: true });
for (let item of items) {
  const type = item.isDirectory() ? "folder" : "file";
  console.log(`${item.name}: ${type}`);
}

async function findFiles(folderName) {
  const items = await fs.readdir(folderName, { withFileTypes: true });
  items.forEach((item) => {
    if (path.extname(item.name) === ".json") {
      // console.log(`Found file: ${item.name} in folder: ${folderName}`);
      console.log(`Found file in folder: ${folderName}/${item.name}.json`);
    } else {
      // this is a folder, so call this method again and pass in
      // the path to the folder
      findFiles(path.join(folderName, item.name));
    }
  });
}

findFiles("stores");
