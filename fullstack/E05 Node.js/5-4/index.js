const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  }
};

const http = require("http")
const fs = require("fs");

let requestCounter = 0;
const hostname = "127.0.0.1"
const port = 3000

const server = http.createServer((req, res) => {
  if(req.url != "/") return;
  requestCounter++;
  fs.appendFile("count.txt", `The request counter value is ${requestCounter}.
`, (error) =>{
    if (error) console.error(error);
  });
  res.write(requestCounter.toString());
  res.end()
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})