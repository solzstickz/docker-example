const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");
const moment = require('moment');

//! domain.com/pages/
router.post("/", async (req, res) => {
    pool.query("SELECT * FROM `pages`;", async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(result);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
});


//! domain.com/pages/:slug
router.post("/:slug", async (req, res) => {
    pool.query(
      `SELECT * FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE pages.pages_slug = ? ORDER BY posts_ep DESC;`,
      [req.params.slug],
      async (err, result) => {
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
                pages_last_ep: first_pages.pages_last_ep
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
              res.status(200).json(pages);
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
});

router.post(
  "/uploads/images",
  uploads.single("uploaded_file"),
  async (req, res) => {
    if(req.file === "undefined"){
      res.status(500).json({ message: "Status Upload Error" });
    }else{
      let path_images = req.file.path;
      res.status(200).json(path_images);
    } 
  }
);

//! domain.com/pages/create/page
router.post("/create/page", async (req, res) => {
  let reqbody = await req.body;
  const formatdatetime = "YYYY-MM-DD HH:mm:ss"
  reqbody.pages_last_update = moment().format(formatdatetime);
  reqbody.pages_detail.info.publish = moment().format(formatdatetime);
  reqbody.pages_detail = await JSON.stringify(reqbody.pages_detail) 
    pool.query(`INSERT INTO pages set ?`,[reqbody], async (err, result) => {
      try {
        if (err) {
          console.log("Status Mysql Insert Error",err);
            res.status(500).json({ message: "Status Mysql Insert Error" });
        } else {
          if (result.insertId > 0){
            res.status(200).json({ message : "Status Insert Success"});
          }else{
            res.status(201).json({ message: "Status Insert Error" });
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
          console.log("Status Delete Error",err);
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

//! domain.com/pages/create/page
router.post("/edit/page/", async (req, res) => {
  let reqbody = await req.body;
  const pages_id = await reqbody.pages_id;
  const formatdatetime = "YYYY-MM-DD HH:mm:ss"
  delete reqbody.pages_id;
  reqbody.pages_last_update = moment().format(formatdatetime);
  reqbody.pages_detail = await JSON.stringify(reqbody.pages_detail) 
    pool.query(`UPDATE pages set ? WHERE pages_id = ?`,[reqbody,pages_id], async (err, result) => {
      try {
        if (err) {
            console.log(`Status Mysql Insert Error` + err);
            res.status(500).json({ message: "Status Mysql Insert Error" });
        } else {
          if (result.changedRows > 0){
            res.status(200).json({ message : "Status Update Success"});
          }else{
            res.status(201).json({ message: "Status Update Error Data Dupicate Please Try Again" });
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
});

  

module.exports = router;
