const fs = require("fs").promises;
const path = require("path");

const items = await fs.readdir("stores");
console.log(items); 

const items = await fs.readdir("stores", { withFileTypes: true });
for (let item of items) {
  const type = item.isDirectory() ? "folder" : "file";
  console.log(`${item.name}: ${type}`);
}

function findFiles(folderName) {
  const items = await fs.readdir(folderName, { withFileTypes: true });
  items.forEach((item) => {
    if (path.extname(item.name) === ".json") {
      console.log(`Found file: ${item.name} in folder: ${folderName}`);
    } else {
      // this is a folder, so call this method again and pass in
      // the path to the folder
      findFiles(path.join(folderName, item.name));
    }
  });
}

findFiles("stores");
