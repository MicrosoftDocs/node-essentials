// To debug in Codespaces or dev container, use
// index-unit-5.js which has the __dirname and path.join needed
// to resolve the path correctly.

const path = require('path');
const fs = require('fs').promises;

async function findSalesFiles(folderName) {
  // (1) Add an array at the top, to hold the paths to all the sales files that the program finds.
  let results = [];

  // (2) Read the currentFolder with the `readdir` method.
  const items = await fs.readdir(folderName, { withFileTypes: true });

  // (3) Add a block to loop over each item returned from the `readdir` function using the asynchronous `for...of` loop.
  for (const item of items) {
    // (4) Add an `if` statement to determine if the item is a file or a directory.
    if (item.isDirectory()) {
      // (5) If the item is a directory, _resursively call the function `findSalesFiles` again, passing in the path to the item.
      const resultsReturned = await findSalesFiles(
        `${folderName}/${item.name}`,
      );
      results = results.concat(resultsReturned);
    } else {
      // (6) If it's not a directory, add a check to make sure the item name matches *sales.json*.
      if (item.name === 'sales.json') {
        results.push(`${folderName}/${item.name}`);
      }
    }
  }

  return results;
}

async function main() {
  const results = await findSalesFiles('stores');
  console.log(results);
}

main();
