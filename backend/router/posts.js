const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const moment = require('moment-timezone');
const uploads = require("../middleware/uploads");
const posts = require('../module/posts');

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

//! domain.com/pages/uploads/pages
router.post('/uploads/posts',uploads.uploads_posts, async function (req, res) {
  console.log('File uploaded successfully.');
  let jsonimg = [];
  for(i in req.files){
    let name = await `uploads/${req.files[i].key}`
   await jsonimg.push({'url':name,'image_no':Number(i)+1});
  }
  console.log(jsonimg);
  await res.status(200).json(jsonimg);
});

//! domain.com/pages/uploads/delete
router.post('/uploads/delete', async function (req, res) {
  const data = await req.body; 
  let keyname = []
  for(i in data){
    let name =  data[i].url;
    keyname.push({Key:name})
  }
  await console.log(keyname);
  await uploads.uploads_posts_delete(keyname,req,res);
});

//! domain.com/pages/create/posts
router.post('/create/post', async function (req, res) {
  await posts.create_posts(req, res)
});

//! domain.com/pages/:slug
router.post("/:slug", async (req, res) => {
  let posts_slug = req.params.slug;
  console.log(posts_slug);
    pool.query(
      `SELECT posts.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE posts_slug = ? ORDER BY posts_ep DESC;`,
      [posts_slug],
      async (err, result) => {
        try {
          if (err) {
            console.log("posts/:slug" + err);
          } else {
            if(result.length > 0){
              res.status(200).json(result[0]);
            }else{
              res.status(201).json({ message: "Page Url Not Found !" });
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

//! domain.com/edit/post
router.post("/edit/post", async (req, res) => {
  await posts.edit_posts(req, res)
});

//! domain.com/pages/:slug
router.post("/delete/:slug", async (req, res) => {
  let posts_id = req.params.slug;
  console.log(posts_id);
  pool.query(`DELETE FROM posts where posts_slug in (?)`,[posts_id], async (err, result) => {
    try {
      if (err) {
        console.log("Status Delete pages Error",err);
        res.status(500).json({ message: "Status Delete Posts Error" });
      } else {
        if (result.affectedRows > 0){
          res.status(200).json({ message : "Status Delete Posts Success"});
        }else {
          res.status(201).json({ message : "Status Delete Posts Not Found"});
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Pages Error" });
    }
  });
});


module.exports = router;
