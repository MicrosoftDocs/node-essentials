// promises asynchronous example

const fs = require('fs').promises;
const filePath = './file.txt';

// request to read a file
fs.readFile(filePath, 'utf8')
    .then((data) => {
        console.log(data);
        console.log('Done!');
    })
    .catch((error) => {
        console.log('An error occurred...: ', error);
    });