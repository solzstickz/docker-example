const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const moment = require("moment-timezone");
const uploads = require("../middleware/uploads");
const posts = require("../module/posts");

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
router.post("/uploads/posts", uploads.uploads_posts, async function (req, res) {
  console.log("File uploaded successfully.");
  let jsonimg = [];
  let insert_to_db = [];
  for (i in req.files) {
    let name = await `uploads/${req.files[i].key}`;
    await jsonimg.push({ url: name, image_no: Number(i) + 1 });
    await insert_to_db.push([name]);
  }
  console.log(insert_to_db);
  pool.query(
    `INSERT INTO img_found (url) values ?`,
    [insert_to_db],
    async (err, result_img_found) => {
      try {
        if (err) {
          console.log("Status Mysql Insert Error", err);
          res
            .status(500)
            .json({ message: "Status Mysql Insert img_found Error" });
        } else {
          if (result_img_found.insertId > 0) {
            await res.status(200).json(jsonimg);
          } else {
            res.status(201).json({ message: "Status Insert img_found Error" });
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
});

//! domain.com/pages/uploads/delete
router.post("/uploads/delete", async function (req, res) {
  const data = await req.body;
  let keyname = [];
  let delete_to_db = [];
  for (i in data) {
    let name = data[i].url;
    await keyname.push({ Key: name });
    await delete_to_db.push(name);
  }
  await uploads.uploads_posts_delete(keyname, req, res, delete_to_db);
});

router.post("/filter_space/delete", async function (req, res) {
  const data = await req.body;
  let delete_to_db = [];
  for (i in data) {
    let name = data[i].Key;
    await delete_to_db.push(name);
  }
  await uploads.uploads_posts_delete(data, req, res, delete_to_db);
});

//! domain.com/pages/create/posts
router.post("/create/post", async function (req, res) {
  await posts.create_posts(req, res);
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
          if (result.length > 0) {
            res.status(200).json(result[0]);
          } else {
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
  await posts.edit_posts(req, res);
});

//! domain.com/pages/:slug
router.post("/delete/:slug", async (req, res) => {
  await posts.delete_posts(req, res);
});

router.post("/delete_select/posts", async (req, res) => {
  const data = await req.body.posts_slug;
  for(i in data){
    await posts.delete_posts(data[i],res,i,data.length);
  }
});

router.post("/images/clear", async function (req, res) {
  pool.query(
    `SELECT * FROM img_found WHERE type = 0 limit 1000;`,
    async (err, result_img_found) => {
      try {
        if (err) {
          console.log("Status Mysql Insert Error", err);
          res
            .status(500)
            .json({ message: "Status Mysql Insert img_found Error" });
        } else {
          if (result_img_found.length > 0) {
            const data = await result_img_found;
            let keyname = [];
            let delete_to_db = [];
            for (i in data) {
              let name = data[i].url;
              await keyname.push({ Key: name });
              await delete_to_db.push(name);
            }
            // console.log(keyname);
            // console.log(delete_to_db);
            await uploads.uploads_posts_delete(keyname, req, res, delete_to_db);
          } else {
            res
              .status(201)
              .json({ message: "Status DELETE img_found Not Found" });
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
});

router.post("/images/notuse", async function (req, res) {
  pool.query(
    `SELECT COUNT(img_found_id) as images_count FROM img_found WHERE type = 0;`,
    async (err, result_img_found) => {
      try {
        if (err) {
          console.log("Status Mysql Insert Error", err);
          res
            .status(500)
            .json({ message: "Status Mysql Insert img_found Error" });
        } else {
          if (result_img_found.length > 0) {
            res
            .status(201)
            .json( result_img_found[0] );
          } else {
            res
            .status(201)
            .json( {
              "images_count": 0
            } );
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
