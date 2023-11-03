// synchronous example

const fs = require('fs');

const filePath = './file.txt';

try {
  // request to read a file
  const data = fs.readFileSync(filePath, 'utf-8');
  console.log(data);
  console.log('Done!');
} catch (error) {
  console.log('An error occurred...: ', error);
}
