const fs = require('fs');

// Promisify a callback function
function promiseRead(fileName) {
  // promise
  return Promise((resolve, reject) => {
    // callback
    fs.readFile(fileName, 'utf-8', (error, data) => {
      if (error) {
        // indicate error
        reject(error);
      } else {
        // indicate success
        resolve(data);
      }
    });
  });
}
