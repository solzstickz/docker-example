const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");

router.post("/", async (req, res) => {
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

router.post("/:slug", async (req, res) => {
  // console.log(req.params.slug);
  // let redis_res = await redisclient.get(`tags:${req.params.slug}`);
  // if (redis_res) {
  //   res.status(200).json(JSON.parse(redis_res));
  // } else {
  pool.query(
    `SELECT pages.*,posts.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts_ep>pages.pages_last_ep-1 && pages_detail LIKE '%${req.params.slug}%' ORDER BY pages.pages_id ASC;`,
    async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
});

module.exports = router;
