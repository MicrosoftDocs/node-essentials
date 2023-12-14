const path = require("path");
const fs = require("fs").promises;

async function findFiles(folderName) {

    let results = []

    results.push(`${folderName}`);

    const relativePathToFolder = path.join(__dirname, folderName);
    const items = await fs.readdir(relativePathToFolder, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            const resultsReturned = await findFiles(`${folderName}/${item.name}`);
            results = results.concat(resultsReturned);
        } else {
            results.push(`${folderName}/${item.name}`);
        }
    }

    return results;
}

findFiles("stores").then((results) => console.log(results));
