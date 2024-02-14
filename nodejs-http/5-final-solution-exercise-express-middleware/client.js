const http = require('http');

const options = {
  port: 3000,
  hostname: 'localhost',
  path: '/users',
  headers: {
    authorization: 'secretpassword'
  },
};

const req = http.get(options, (res) => {
  console.log(`Connected - Status Code ${res.statusCode}`);

  res.on('data', (chunk) => {
    console.log("Chunk data: ", chunk.toString());
  });

  res.on('end', () => {
    console.log('No more data');
  });

  res.on('close', () => {
    console.log('Connection closed');
  });
});

req.on('error', (error) => {
  console.error('An error occurred: ', error);
});

req.end();