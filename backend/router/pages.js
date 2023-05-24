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

router.post("/sitemap", async (req, res) => {
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
router.post("/:slug", async (req, res) => {
  let redis_res = await redisclient.get(`pages:full:${req.params.slug}`);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
  } else {
    pool.query(
      `SELECT * FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE pages.pages_slug = ? ORDER BY posts_ep DESC;`,
      [req.params.slug],
      async (err, result) => {
        console.log(result);
        try {
          if (err) {
            console.log("pages/:slug" + err);
          } else {
            if (result.length === 0) {
              res.status(404).json({ message: "Page Url Not Found !" });
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
                pages_tags: first_pages.pages_tags,
                pages_detail: first_pages.pages_detail,
              });

              _.forEach(result, (value, key) => {
                posts.push({
                  posts_id: value.posts_id,
                  posts_slug: value.posts_slug,
                  posts_ep: value.posts_ep,
                  posts_detail: value.posts_detail,
                  posts_create: value.posts_create,
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

//! domain.com/pages/create/page
router.post("/create/page", async (req, res) => {
  let reqbody = await req.body;
  reqbody.pages_detail = await JSON.stringify(reqbody.pages_detail) 
    pool.query(`INSERT INTO pages set ?`,[reqbody], async (err, result) => {
      try {
        if (err) {
          console.log(err);
            res.status(500).json({ message: "Status Insert Error" });
        } else {
          if (result.insertId > 0){
            res.status(200).json({ message : "Status Insert Success"});
          }else{
            res.status(500).json({ message: "Status Insert Error" });
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
});

//! domain.com/pages/delete/page
router.post("/delete/page", async (req, res) => {
  let reqbody = await req.body;
  var data_value  = await reqbody.map(head => head.pages_id)
    pool.query(`DELETE FROM pages where pages_id in (?)`,[data_value], async (err, result) => {
      try {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Status Delete Error" });
        } else {
          console.log(result);
          if (result.affectedRows > 0){
            res.status(200).json({ message : "Status Delete Success"});
          }else {
            res.status(200).json({ message : "Status Delete Not Found"});
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
});

  

module.exports = router;
