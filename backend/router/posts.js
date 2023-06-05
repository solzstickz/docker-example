const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const uploads = require("../middleware/uploads");

router.post("/", async (req, res) => {
  try {
    let redis_res = await redisclient.get("posts:res");
    if (redis_res) {
      res.status(200).json(JSON.parse(redis_res));
    } else {
      pool.query("SELECT * FROM `posts`;", async (err, result) => {
        try {
          if (err) {
            console.log(err);
          } else {
            await redisclient.set(
              "posts:res",
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get("posts:res");
            res.status(200).json(JSON.parse(data));
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/uploads',uploads, function (req, res, next) {
  console.log('File uploaded successfully.');
  console.log(req.files[0].key);
  const path = `uploads/${req.files[0].key}`
  res.json({url:`${path}`});
});

router.post("/:slug", async (req, res) => {
  let redis_res = await redisclient.get(`post/:slug:${req.params.slug}`);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query(
      `SELECT * FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE posts_slug = ? ORDER BY posts_ep DESC;`,
      [req.params.slug],
      async (err, result) => {
        try {
          if (err) {
            console.log("posts/:slug" + err);
          } else {
            if (result.length === 0) {
              res.status(404).json({ message: "Page Url Not Found !" });
            }
            await redisclient.set(
              `post/:slug:${req.params.slug}`,
              JSON.stringify(result),
              "EX",
              60
            );
            let data = await redisclient.get(`post/:slug:${req.params.slug}`);
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
