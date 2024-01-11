const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/products", (req,res) => {
    const products = [
      {
        id: 1,
        name: "hammer",
      },
      {
        id: 2,
        name: "screwdriver",
      },
      ,
      {
        id: 3,
        name: "wrench",
      },
    ];
 
   res.json(products);
})

app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));


