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

router.get("/sitemap/pages/slug", async (req, res) => {
  let redis_key = "public:/sitemap/pages/slug"
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
  pool.query(
    "SELECT pages.pages_slug FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts.posts_ep=pages.pages_last_ep ORDER BY pages.pages_id ASC;",
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

router.get("/sitemap/tags/slug", async (req, res) => {
  let redis_key = "public:/sitemap/tags/slug"
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
  pool.query(
    "SELECT tags.tags_slug FROM tags ORDER BY tags_id ASC",
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

router.get("/sitemap/posts/slug", async (req, res) => {
  let redis_key = "public:/sitemap/posts/slug"
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
  pool.query(
    "SELECT posts.posts_slug FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id ORDER BY posts_id ASC;",
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


//! domain.com/pages/:slug
router.get("/pages/:slug", async (req, res) => {
  let redis_key = `public:pages/${req.params.slug}`;
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
  pool.query(
    `SELECT * FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE pages.pages_slug = ? ORDER BY posts_ep DESC;`,
    [req.params.slug],
    async (err, result_pages) => {
      try {
        if (err) {
          console.log(`public/pages/` + err);
        } else {
          if (result_pages.length === 0) {
            res.status(404).json({ message: "Page Url Not Found !" });
          } else {
            pool.query(
              `SELECT tags.* FROM pages INNER JOIN pages_tags ON pages_tags.pages_id=pages.pages_id INNER JOIN tags ON tags.tags_id=pages_tags.tags_id where pages.pages_slug=? ORDER BY tags.tags_name ASC;`,
              [req.params.slug],
              async (err, result_tags) => {
                try {
                  if (err) {
                    console.log(`public/pages/` + err);
                  } else {
                    if (result_tags.length === 0) {
                      res.status(404).json({ message: "Page Url Not Found !" });
                    } else {
                      let full_data = ({pages:result_pages,tags:result_tags})
                      await redis_server.set(redis_key, full_data);
                      let data = await redisclient.get(redis_key);
                      res.status(200).json(JSON.parse(data));
                    }
                  }
                } catch (err) {
                  console.log(err);
                  res.status(500).json({ message: "Internal Server Error" });
                }
              }
            );
          }
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

router.get("/tags/:slug", async (req, res) => {
  let redis_key = `public:tags/${req.params.slug}`;
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log('found');
  } else {
  pool.query(
    "SELECT pages.*,posts.*,tags.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id INNER JOIN pages_tags ON pages.pages_id = pages_tags.pages_id INNER JOIN tags ON pages_tags.tags_id=tags.tags_id  where posts.posts_ep=pages.pages_last_ep and tags.tags_slug='action' ORDER BY pages.pages_last_update DESC;",
    [req.params.slug],
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



module.exports = router;
