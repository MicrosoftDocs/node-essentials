const fs = require('fs').promises;
const path = require('path');

async function calculateSalesTotal(salesFiles) {
  let salesTotal = 0;

  for (file of salesFiles) {
    const fileContents = await fs.readFile(file);
    const data = JSON.parse(fileContents);
    salesTotal += data.total;
  }
  return salesTotal;
}

async function findSalesFiles(folderName) {
  let results = [];

  try {
    const items = await fs.readdir(folderName, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        const resultsReturned = await findSalesFiles(
          path.join(folderName, item.name),
        );
        results = results.concat(resultsReturned);
      } else {
        if (path.extname(item.name) === '.json') {
          results.push(`${folderName}/${item.name}`);
        }
      }

      return results;
    }
  } catch (error) {
    console.error('Error reading folder:', error.message);
    throw error;
  }
}

async function main() {
  const salesDir = path.join(__dirname, '..', 'stores');
  const salesTotalsDir = path.join(__dirname, '..', 'salesTotals');

  try {
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  const salesFiles = await findSalesFiles(salesDir);

  const salesTotal = await calculateSalesTotal(salesFiles);

  await fs.writeFile(
    path.join(salesTotalsDir, 'totals.txt'),
    `${salesTotal}\r\n`,
    { flag: 'a' },
  );
  console.log(`Wrote sales totals to ${salesTotalsDir}`);
}

main();
