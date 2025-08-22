const fs = require('fs').promises;
const path = require('path');

async function calculateSalesTotal(salesFiles) {
  // Final sales total
  let salesTotal = 0;

  // (1) Tterates over the `salesFiles` array.
  for (file of salesFiles) {
    // (2) Reads the file.
    const fileContents = await fs.readFile(file);

    // (3) Parses the content as JSON.
    const data = JSON.parse(fileContents);

    // (4) Increments the `salesTotal` variable with the `total` value from the file.
    salesTotal += data.total;
  }
  return salesTotal;
}

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
        // (5) If the item is a directory, recursively call the function `findSalesFiles` again, passing in the path to the item.
        const resultsReturned = await findSalesFiles(
          path.join(folderName, item.name),
        );
        results = results.concat(resultsReturned);
      } else {
        // (6) If it's not a directory, add a check to make sure the item name matches *sales.json*.
        if (path.extname(item.name) === '.json') {
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
  const salesDir = path.join(__dirname, '..', 'stores');
  const salesTotalsDir = path.join(__dirname, '..', 'salesTotals');

  // create the salesTotal directory if it doesn't exist
  try {
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  // find paths to all the sales files
  const salesFiles = await findSalesFiles(salesDir);

  // read through each sales file to calculate the sales total
  const salesTotal = await calculateSalesTotal(salesFiles);

  // write the total to the "totals.json" file
  await fs.writeFile(
    path.join(salesTotalsDir, 'totals.txt'),
    `${salesTotal}\r\n`,
    { flag: 'a' },
  );
  console.log(`Wrote sales totals to ${salesTotalsDir}`);
}

main();
