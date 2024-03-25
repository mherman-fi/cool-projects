const fs = require("fs");

console.log("Reading file and calculating sum...");

fs.readFile("5-3.txt", "utf8", (err, data) => {
  if (err) throw err;
  const numbers = data.split(",").map(Number);
  const sum = numbers.reduce((total, num) => total + num, 0);
  console.log(`The sum is ${sum}.`);
});