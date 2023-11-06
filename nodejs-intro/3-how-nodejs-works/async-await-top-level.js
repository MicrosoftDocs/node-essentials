// top-level async/await asynchronous example

const fs = require('fs').promises;

const filePath = './file.txt';

// `async` before the parent function
try {
  // `await` before the async method
  const data = await fs.readFile(filePath, 'utf-8');
  console.log(data);
  console.log('Done!');
} catch (error) {
  console.log('An error occurred...: ', error);
}
console.log("I'm the last line of the file!");
