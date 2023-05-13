const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");


//! domain.com/pages/
router.post("/", async (req, res) => {
  let redis_res = await redisclient.get("pages:res");

  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query("SELECT * FROM `pages`;", async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          // push result.length to result
          let total_pages = result.length;
          let total = { posts_total: { total_pages } };
          value = result.push(total);
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

router.post("/:slug", async (req, res) => {
  let redis_res = await redisclient.get(`pages:${req.params.slug}`);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query(
      `SELECT * FROM pages WHERE pages_slug = '${req.params.slug}';`,
      async (err, result) => {
        try {
          if (err) {
            console.log("pages/:slug" + err);
          } else {
            await redisclient.set(
              `pages:${req.params.slug}`,
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get(`pages:${req.params.slug}`);
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
