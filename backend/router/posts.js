const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const moment = require('moment-timezone');
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

router.post('/create/post', async function (req, res) {
    let reqbody = await req.body;
    const pages_slug = req.body.pages_slug;
    delete reqbody.pages_slug;
    console.log(reqbody);
    const formatdatetime = "YYYY-MM-DD HH:mm:ss"
    reqbody.posts_create = moment().tz('Asia/Bangkok').format(formatdatetime);
      pool.query(`SELECT * FROM pages where pages_slug=? ORDER BY pages_last_update DESC LIMIT 1;`,[pages_slug], async (err, result_pages_id) => {
        try {
          if (err) {
              console.log("Status Mysql Insert Error",err);
              res.status(500).json({ message: "Status Mysql Select Pages_slug Error" });
          } else {
            if (result_pages_id.length > 0){
              reqbody.pages_id = result_pages_id[0].pages_id
              console.log(result_pages_id);
               for(i in reqbody.posts_detail){
                let alt =`${pages_slug}-ตอนที่-${reqbody.posts_ep}-${reqbody.posts_detail[i].image_no}`;
                reqbody.posts_detail[i].alt = alt;
              }
              reqbody.posts_detail = JSON.stringify(reqbody.posts_detail)
              console.log(reqbody);
              pool.query(`INSERT INTO posts set ?`,[reqbody], async (err, result) => {
                try {
                  if (err) {
                      console.log("Status Mysql Insert Error",err);
                      res.status(500).json({ message: "Status Mysql Posts Insert Error" });
                  } else {
                    if (result.insertId > 0){
                      res.status(200).json({ message: "Status Posts Insert Success" });
                    }else{
                      res.status(201).json({ message: "Status Posts Insert Not found" });
                    }
                  }
                } catch (err) {
                  console.log(err);
                  res.status(500).json({ message: "Internal Server Error" });
                }
              });
            }else{
              res.status(201).json({ message: "Status Pages_slug Not_found" });
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
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
