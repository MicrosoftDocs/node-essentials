const path = require("path");
const fs = require("fs").promises;

let results = []

async function findFiles(folderName) {
    results.push(`${folderName}`);

    const relativePathToFolder = path.join(__dirname, folderName);
    const items = await fs.readdir(relativePathToFolder, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            await findFiles(`${folderName}/${item.name}`);
        } else {
            results.push(`${folderName}/${item.name}`);
        }
    }
}

findFiles("stores").then(() => console.log(results));