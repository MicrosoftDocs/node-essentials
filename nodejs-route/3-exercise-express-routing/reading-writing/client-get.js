const http = require('http')

http.get({ path: '/products', hostname: 'localhost', port: 3000 }, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += "" + chunk })
  res.on('end', () => { console.log('Received data', body) })
  res.on('close', () => { console.log('Connection closed') })
})