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
  const message = process.env.MESSAGE || "hello from code";
  res.status(200).json({ message, database: process.env.DB_NAME });
});

////CUSTOM MIDDLEWARES
//// 1. LOGGER
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

server.use("/api/users", userRouter);

module.exports = server;
