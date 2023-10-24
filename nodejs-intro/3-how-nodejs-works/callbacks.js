// callback asynchrounous example

const fs = require('fs');
const filePath = './file.txt';

// request to read a file
fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
        console.log('An error occurred...: ', error);
    } else {
        console.log(data);
        console.log('Done!');
    }
});