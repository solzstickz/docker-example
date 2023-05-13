const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");

router.post("/", async (req, res) => {
  let redis_res = await redisclient.get("posts:res");
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query("SELECT * FROM `posts`;", async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          await redisclient.set("posts:res", JSON.stringify(result), "EX", 60);
          let data = await redisclient.get("posts:res");
          res.status(200).json(JSON.parse(data));
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  }
});

router.post("/:slug", async (req, res) => {
  let redis_res = await redisclient.get(`posts:${req.params.slug}`);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query(
      `SELECT * FROM posts WHERE posts_slug = '${req.params.slug}';`,
      async (err, result) => {
        try {
          if (err) {
            console.log("posts/:slug" + err);
          } else {
            await redisclient.set(
              `posts:${req.params.slug}`,
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get(`posts:${req.params.slug}`);
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

module.exports = router;
