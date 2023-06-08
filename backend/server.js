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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/tags", tags);
app.use("/search", search);
app.use("/public", public);

app.use("/auth", auth);

//! setting up the express app

//! Routes index
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Sv1" });
});






app.post("/poppular", async (req, res) => {
  let redis_res = await redisclient.get("pages:res");

  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query("SELECT * FROM `pages`;", async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          await redisclient.set("pages:res", JSON.stringify(result), "EX", 60);
          let data = await redisclient.get("pages:res");
          res.status(200).json(JSON.parse(data));
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  }
});
app.post("/last_updated", async (req, res) => {
  let redis_res = await redisclient.get(`/last_updated`);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query(
      "SELECT pages.*,posts.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts_ep>pages.pages_last_ep-1 ORDER BY pages.pages_last_update ASC;",
      async (err, result) => {
        try {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              res.status(404).json({ message: "Not Found" });
            }
            await redisclient.set(
              `/last_updated`,
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get(`/last_updated`);
            res.status(200).json(JSON.parse(data));
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

//! Server Running
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
