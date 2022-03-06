const express = require("express");
const app = express();
const port = 3000;

const products = [
  {
    id: 1,
    name: "Ivanhoe",
    author: "Sir Walter Scott",
  },
  {
    id: 2,
    name: "Colour Magic",
    author: "Terry Pratchett",
  },
  {
    id: 3,
    name: "The Bluest eye",
    author: "Toni Morrison",
  },
];

app.get("/", (req, res) => res.send("Hello API!"));

app.get("/products/:id", (req, res) => {
  res.json(products.find((p) => p.id === +req.params.id));
});

app.get("/products", (req, res) => {
  const page = +req.query.page;
  const pageSize = +req.query.pageSize;

  if (page && pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    res.json(products.slice(start, end));
  } else {
    res.json(products);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
