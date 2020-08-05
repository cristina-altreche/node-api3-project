const express = require("express");

const morgan = require("morgan");
const helmet = require("helmet");
const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

server.get("/", (req, res) => {
  const nameInsert = req.name ? `${req.name}` : ""

  res.send(`<h2>Let's write some middleware!</h2>
  <p>Welcome ${nameInsert} to the Lambda Users API</p>`
  
  );
});

//custom middleware

function logger(req, res, next) {
  const name = req.headers.name;
  req.name = name;
  console.log(`${req.name} made a ${req.method} request to ${req.url}`);
  next();
}

module.exports = server;
