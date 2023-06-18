const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");
const moment = require("moment");
const axios = require("axios");
const redis_server = require("../module/server_redis");

//! domain.com/pages/
router.get("/pages/", async (req, res) => {
  let redis_key = "public:pages"
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
    console.log('not found');
    pool.query("SELECT * FROM `pages`;", async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          // await  redisclient.sendCommand(['SET','peng' ,JSON.stringify(result),'EX','60']).then((result,err) => {});
          await redis_server.set(redis_key, result);
          let data = await redisclient.get(redis_key);
          res.status(200).json(JSON.parse(data));
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  }
});

router.get("/last_updated", async (req, res) => {
  let redis_key = "public:last_updated"
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
  pool.query(
    "SELECT pages.*,posts.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts.posts_ep=pages.pages_last_ep ORDER BY pages.pages_last_update DESC;",
    async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          if (result.length === 0) {
            res.status(404).json({ message: "Not Found" });
          }
          await redis_server.set(redis_key, result);
          let data = await redisclient.get(redis_key);
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

router.get("/pages/sitemap", async (req, res) => {
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

//! domain.com/pages/:slug
router.get("/pages/:slug", async (req, res) => {
  let redis_res = await redisclient.get(`public/pages/${req.params.slug}`);
  // if (redis_res) {
  //   res.status(200).json(JSON.parse(redis_res));
  // } else {
  pool.query(
    `SELECT * FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE pages.pages_slug = ? ORDER BY posts_ep DESC;`,
    [req.params.slug],
    async (err, result) => {
      try {
        if (err) {
          console.log(`public/pages/` + err);
        } else {
          if (result.length === 0) {
            res.status(404).json({ message: "Page Url Not Found !" });
          } else {
            await redisclient.set(
              `public/pages/${req.params.slug}`,
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get(`public/pages/${req.params.slug}`);
            res.status(200).json(JSON.parse(data));
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
  // }
});


module.exports = router;
