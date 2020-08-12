const express = require('express')
const app = express()
const port = 3000

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let products = [];

app.post('/products', function (req, res) {
  // implement
});

app.put('/products', function (req, res) {
  // implement
});

app.delete('/products/:id', function (req, res) {
  // implement
});

app.get('/products', (req, res) => {
  // implement
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  
