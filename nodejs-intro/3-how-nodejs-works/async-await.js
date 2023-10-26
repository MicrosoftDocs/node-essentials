// async/await asynchronous example

const fs = require('fs').promises;
const filePath = './file.txt';

async function readFileAsync() {
    try {
        // request to read a file
        const data = await fs.readFile(filePath, 'utf8');
        console.log(data);
        console.log('Done!');
    } catch (error) {
        console.log('An error occurred...: ', error);
    }
}

readFileAsync();