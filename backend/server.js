const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const redisclient = require("./config/redis");
const pool = require("./config/mysql");
const token = require("./middleware/token");
const _ = require("lodash");
const port = process.env.SERVER_PORT;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.use(bodyParser.json({limit: '300mb'}));
app.use(bodyParser.urlencoded({limit: '300mb', extended: true}));
require("dotenv").config();

//! Routes
const pages = require("./router/pages");
const posts = require("./router/posts");
const tags = require("./router/tags");
const auth = require("./middleware/auth");
const search = require("./router/search");
const public = require("./router/public");

//! middleware - token.authenticateToken
app.use("/uploads", express.static("uploads"));
app.use("/pages", token.authenticateToken, pages);
app.use("/posts", posts);
app.use("/tags", token.authenticateToken, tags);
app.use("/search", token.authenticateToken, search);
app.use("/public", public);

app.use("/auth", auth);

app.disable('x-powered-by')

//! setting up the express app

//! Routes index
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Sv1" });
});



//! Server Running
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
