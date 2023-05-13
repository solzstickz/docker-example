const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const redisclient = require("./config/redis");
const pool = require("./config/mysql");
const token = require("./middleware/token");


app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
//! Routes
const pages = require("./router/pages");
const posts = require("./router/posts");
const auth = require("./middleware/auth");

//! middleware - token.authenticateToken
app.use("/pages", token.authenticateToken, pages);
app.use("/posts", token.authenticateToken, posts);
app.use("/auth", auth);

require("dotenv").config();

const port = process.env.SERVER_PORT;

//! setting up the express app

//! Routes index

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//! Server Running
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
