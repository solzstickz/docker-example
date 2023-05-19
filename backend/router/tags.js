const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");

router.post("/", async (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

router.post("/:slug", async (req, res) => {
  // console.log(req.params.slug);
  // let redis_res = await redisclient.get(`tags:${req.params.slug}`);
  // if (redis_res) {
  //   res.status(200).json(JSON.parse(redis_res));
  // } else {
  pool.query(
    `SELECT * FROM pages WHERE pages_tags LIKE "%${req.params.slug}%";`,
    async (err, result) => {
      try {
        if (err) {
          console.log("tags/:slug" + err);
        } else {
          if (result.length === 0) {
            res.status(404).json({ message: "Page Url Not Found !" });
          } else {
            await redisclient.set(
              `tags/:slug:${req.params.slug}`,
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get(`tags/:slug:${req.params.slug}`);
            res.status(200).json(JSON.parse(data));
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
});

module.exports = router;
