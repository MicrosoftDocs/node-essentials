const path = require("path");

const currentPath = path.parse("stores/201/sales.json")
console.log(currentPath);

const fullPath = path.join(__dirname, "stores", "201", "/sales.json");
console.log(path.parse(fullPath));