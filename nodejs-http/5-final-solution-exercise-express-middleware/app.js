const express = require('express');
const app = express();
const port = 3000;

function isAuthorized(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'secretpassword') {
    return res.status(401).send('Unauthorized: Access Denied');
  }

  next();
}


app.get('/', isAuthorized, (req, res) => res.send('Hello World!'));

app.get('/users', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'User Userson'
    },
  ]);
});

app.get("/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: 'The Bluest Eye'
    },
  ]);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});