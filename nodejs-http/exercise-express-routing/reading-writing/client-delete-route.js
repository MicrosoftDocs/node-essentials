const http = require('http');

const data = JSON.stringify({
  id: 1
})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/products',
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const request = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += "" + chunk; })
  res.on('error', (err) => console.error('err', err))
  res.on('end', () => { console.log('response', body) })
  res.on('close', () => { console.log('Closed connection') })
})

request.end(data);
