// async/await asynchronous example

const fs = require('fs').promises;

const filePath = './file.txt';

// `async` before the parent function
async function readFileAsync() {
  try {
    // `await` before the async method
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(data);
    console.log('Done!');
  } catch (error) {
    console.log('An error occurred...: ', error);
  }
}

readFileAsync()
  .then(() => {
    console.log('Success!');
  })
  .catch((error) => {
    console.log('An error occurred...: ', error);
  });
