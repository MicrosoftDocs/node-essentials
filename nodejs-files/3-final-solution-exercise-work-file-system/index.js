const fs = require("fs").promises;

async function findSalesFiles(folderName) {
  let results = [];

  try {
    const items = await fs.readdir(folderName, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const resultsReturned = await findSalesFiles(`${folderName}/${item.name}`);
        results = results.concat(resultsReturned);
      } else {
        if (item.name === "sales.json") {
          results.push(`${folderName}/${item.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading folder:', error.message);
    throw error; 
  }

  return results;
}

async function main() {
  // Use "../stores" to navigate to the sibling 'stores' folder
  const storesFolderPath = `${__dirname}/../stores`;

  try {
    const results = await findSalesFiles(storesFolderPath);
    console.log(results);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
