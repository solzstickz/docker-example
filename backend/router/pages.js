const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");
const moment = require('moment');
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
router.post('/uploads/pages',uploads, function (req, res, next) {
  console.log('File uploaded successfully.');
  console.log(req.files[0].key);
  const path = `uploads/${req.files[0].key}`
  res.status(200).json({url:`${path}`});
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





  

module.exports = router;
