const fs = require('fs').promises;
const path = require('path');

async function findSalesFiles(folderName) {
  // (1) Add an array at the top, to hold the paths to all the sales files that the program finds.
  let results = [];

  try {
    // (2) Read the currentFolder with the `readdir` method.
    const items = await fs.readdir(folderName, { withFileTypes: true });

    // (3) Add a block to loop over each item returned from the `readdir` function using the asynchronous `for...of` loop.
    for (const item of items) {
      // (4) Add an `if` statement to determine if the item is a file or a directory.
      if (item.isDirectory()) {
        // (5) If the item is a directory, _resursively call the function `findSalesFiles` again, passing in the path to the item.
        const resultsReturned = await findSalesFiles(
          path.join(folderName, item.name),
        );
        results = results.concat(resultsReturned);
      } else {
        if (path.extname(item.name) === '.json') {
          results.push(`${folderName}/${item.name}`);
        }
      }
    }
  } catch (error) {
    // (6) If it's not a directory, add a check to make sure the item name matches *sales.json*.
    console.error('Error reading folder:', error.message);
    throw error;
  }

  return results;
}

async function main() {
  const salesDir = path.join(__dirname, '..', 'stores');

  // find paths to all the sales files
  const salesFiles = await findSalesFiles(salesDir);
  console.log(salesFiles);
}

main();
