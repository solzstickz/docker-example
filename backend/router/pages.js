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
      `SELECT GROUP_CONCAT(tags.tags_name SEPARATOR ',') as tags_name_all,GROUP_CONCAT(tags.tags_id SEPARATOR ',') as tags_id_all,GROUP_CONCAT(tags.tags_slug SEPARATOR ',') as tags_slug_all,pages.* FROM pages INNER JOIN pages_tags ON pages_tags.pages_id=pages.pages_id INNER JOIN tags ON tags.tags_id=pages_tags.tags_id WHERE pages.pages_slug = ? GROUP BY pages.pages_id ORDER BY tags.tags_name ASC;`,
      [req.params.slug],
      async (err, result) => {
        try {
          if (err) {
            console.log("pages/:slug" + err);
          } else {
            if (result.length === 0) {
              res.status(404).json({ message: "Page Url Not Found !" });
            } else {
              let data = result
              let tags_name = result[0].tags_name_all.split(",");
              let tags_id = result[0].tags_id_all.split(",");
              let tags_slug = result[0].tags_slug_all.split(",");
              let pages_tags= [];
              for(i in tags_id){
                console.log(tags_id[i],tags_name[i]);
                pages_tags.push({
                  tags_id : Number(tags_id[i]),
                  tags_name: tags_name[i],
                  tags_slug: tags_slug[i]
                })
              }
              console.log(pages_tags);
              data[0]["pages_tags"] = pages_tags
              delete data[0].tags_name_all
              delete data[0].tags_id_all;
              console.log(data);
              res.status(200).json(data[0]);
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
});

//! domain.com/pages/uploads/pages
router.post('/uploads/pages',uploads, function (req, res, next) {
  console.log('File uploaded successfully.');
  console.log(req.files[0].key);
  const path = `uploads/${req.files[0].key}`
  res.json({url:`${path}`});
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
  let reqbody_tags = await req.body.pages_tags;
  let reqbody_pages = await req.body;
  console.log(reqbody_pages);
  delete reqbody_pages.pages_tags;
  const formatdatetime = "YYYY-MM-DD HH:mm:ss"
  reqbody_pages.pages_last_update = moment().format(formatdatetime);
    pool.query(`INSERT INTO pages set ?`,[reqbody_pages], async (err, result) => {
      try {
        if (err) {
            console.log("Status Mysql Insert Error",err);
            res.status(500).json({ message: "Status Mysql Insert Pages Error" });
        } else {
          if (result.insertId > 0){
            let new_tags = reqbody_tags.map((tags) => {
             return  {"tags_id":tags.tags_id,"pages_id":result.insertId}
            })
            //  new_tags = JSON.stringify(new_tags);
            console.log(new_tags);
            const values = new_tags.map((item) => [item.tags_id, item.pages_id]);
            pool.query(`INSERT INTO pages_tags (tags_id,pages_id) values ?`,[values], async (err, result_pages_tags) => {
              try {
                if (err) {
                  console.log("Status Mysql Insert Error",err);
                  res.status(500).json({ message: "Status Mysql Insert Pages_tags Error" });
                }else{
                  if (result_pages_tags.insertId > 0){
                    res.status(200).json({ message : "Status Insert Success"});
                  }else{
                    res.status(201).json({ message: "Status Insert Pages_tags Error" });
                  }
                }
              }catch (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error" });
              }
            });
          }else{
            res.status(201).json({ message: "Status Insert Pages Error" });
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
    pool.query(`DELETE FROM pages_tags where pages_id in (?)`,[data_value], async (err, result) => {
      try {
        if (err) {
          console.log("Status Delete pages_tags Error",err);
          res.status(500).json({ message: "Status Delete pages_tags Error" });
        } else {
          console.log(result);
            pool.query(`DELETE FROM pages where pages_id in (?)`,[data_value], async (err, result_pages) => {
              try {
                if (err) {
                  console.log("Status Delete pages Error",err);
                  res.status(500).json({ message: "Status Delete pages Error" });
                } else {
                  if (result_pages.affectedRows > 0){
                    res.status(200).json({ message : "Status Delete Pages Success"});
                  }else {
                    res.status(201).json({ message : "Status Delete Pages Not Found"});
                  }
                }
              } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Pages Error" });
              }
            });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server pages_tags Error" });
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
