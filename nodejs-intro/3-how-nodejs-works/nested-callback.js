// nested callback example

// file system module from Node.js
const fs = require('fs');

fs.readFile(param1, param2, (error, data) => {
  if (!error) {
    fs.writeFile(paramsWrite, (error, data) => {
      if (!error) {
        fs.readFile(paramsRead, (error, data) => {
          if (!error) {
            // do something
          }
        });
      }
    });
  }
});
