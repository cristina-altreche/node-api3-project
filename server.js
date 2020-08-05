const express = require("express");
const userRouter = require("./users/userRouter");
const morgan = require("morgan");
const helmet = require("helmet");
const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

server.get("/", (req, res) => {
  // const nameInsert = req.name ? `${req.name}` : ""
  res.send(`<h2>Let's write some middleware!</h2>  `);
});

////CUSTOM MIDDLEWARES
//// 1. LOGGER
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

server.use("/api/users", userRouter);

module.exports = server;
