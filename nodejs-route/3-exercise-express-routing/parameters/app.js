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

app.get("/products/:id", (req, res) => {});

app.get("/products", (req, res) => {});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
