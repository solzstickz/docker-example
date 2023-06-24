const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");
const moment = require('moment-timezone');
const pages = require('../module/pages');

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
  await pages.slug_pages(req, res)
});

//! domain.com/pages/uploads/pages
router.post('/uploads/pages',uploads.uploads_pages, function (req, res, next) {
  console.log('File uploaded successfully.');
  const path = `uploads/${req.files[0].key}`
  if(path.length > 8) {
    pool.query(`INSERT INTO img_found (url) values (?)`,path, async (err, result_img_found) => {
      try {
        if (err) {
          console.log("Status Mysql Insert Error",err);
          res.status(500).json({ message: "Status Mysql Insert img_found Error" });
        }else{
          if (result_img_found.insertId > 0){
            res.status(200).json({url:`${path}`});
          }else{
            res.status(201).json({ message: "Status Insert img_found Error" });
          }
        }
      }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  }
});

// router.post(
//   "/uploads/images",
//   uploads.single("uploads_pages_thumbnail"),
//   async (req, res) => {
//     if(req.file === "undefined"){
//       res.status(500).json({ message: "Status Upload Error" });
//     }else{
//       let path_images = req.file.path;
//       res.status(200).json(path_images);
//     } 
//   }
// );

//! domain.com/pages/create/page
router.post("/create/page", async (req, res) => {
  await pages.create_pages(req, res);
});


//! domain.com/pages/delete/page
router.post("/delete/page", async (req, res) => {
  await pages.delete_pages(req, res);
});

//! domain.com/pages/create/page
router.post("/edit/page/", async (req, res) => {
  await pages.edit_pages(req, res);
});

router.post("/posts/:slug", async (req, res) => {
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
            res.status(200).json(result);
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
