const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");

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

router.post("/full/:slug", async (req, res) => {
  let redis_res = await redisclient.get(`pages:full:${req.params.slug}`);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query(
      `SELECT * FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE pages.pages_slug = ?`,
      [req.params.slug],
      async (err, result) => {
        try {
          if (err) {
            console.log("pages/:slug" + err);
          } else {
            const pages = [];
            const posts = [];
            let first_pages = _.head(result);
            pages.push({
              pages_id: first_pages.pages_id,
              pages_slug: first_pages.pages_slug,
              pages_view: first_pages.pages_view,
              pages_last_update: first_pages.pages_last_update,
              pages_status_showing: first_pages.pages_status_showing,
              pages_detail: first_pages.pages_detail,
            });

            _.forEach(result, (value, key) => {
              posts.push({
                posts_id: value.posts_id,
                posts_ep: value.posts_ep,
                posts_detail: value.posts_detail,
                posts_view: value.posts_view,
              });
            });
            pages.push(posts);
            await redisclient.set(
              `pages:full:${req.params.slug}`,
              JSON.stringify(pages),
              "EX",
              60
            );
            let data = await redisclient.get(`pages:full:${req.params.slug}`);
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

router.post(
  "/uploads/images",
  uploads.single("uploaded_file"),
  async (req, res) => {
    let path_images = req.file.path;
    res.status(200).json(path_images);
  }
);

module.exports = router;
