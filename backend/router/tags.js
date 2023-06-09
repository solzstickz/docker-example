const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");
// const tags = require("../module/tags");

router.post("/", async (req, res) => {
  pool.query(
    "SELECT * FROM tags ORDER BY tags.tags_name ASC;",
    async (err, result) => {
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
    }
  );
});

router.post("/create/tag", async (req, res) => {
  // await pages.create_tags(req, res);
  let reqbody = await req.body;
  pool.query(`INSERT INTO tags set ?`, [reqbody], async (err, result) => {
    try {
      if (err) { 
        console.log("Status Mysql Insert tags Error", err);
        res.status(500).json({ message: "Status Mysql Insert tags Error" });
      } else {
        if (result.insertId > 0) {
          res.status(200).json({ message: "Status Insert tags Success" });
        } else {
          res.status(201).json({ message: "Status Insert tags Error" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

router.post("/:slug/", async (req, res) => {
  pool.query(
    `SELECT * FROM tags where tags.tags_slug='${req.params.slug}' LIMIT 1;`,
    async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(result[0]);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
});

router.post("/edit/tag", async (req, res) => {
  // await pages.create_tags(req, res);
  let reqbody = await req.body;
  const tags_id = await reqbody.tags_id;
  pool.query(`UPDATE tags set ? WHERE tags_id = ?`, [reqbody,tags_id], async (err, result) => {
    try {
      if (err) {
        console.log("Status Mysql Insert Error", err);
        res.status(500).json({ message: "Status Mysql Update tags Error" });
      } else {
        console.log(result);
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Status Update tags Success" });
        } else {
          res.status(201).json({ message: "Status Update tags Error" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

router.post("/delete/tag", async (req, res) => {
  // await pages.create_tags(req, res);
  let reqbody = await req.body;
  pool.query(`DELETE FROM tags where tags_id in (?)`,[reqbody.tags_id], async (err, result) => {
    try {
      if (err) {
        console.log("Status Delete tags Error",err);
        res.status(500).json({ message: "Status Delete tags Error" });
      } else {
        console.log(result);
        if (result.affectedRows > 0){
          res.status(200).json({ message : "Status Delete tags Success"});
        }else {
          res.status(201).json({ message : "Status Delete tags Not Found"});
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server tags Error" });
    }
  });
});
// router.post("/", async (req, res) => {
//   let redis_res = await redisclient.get(`/last_updated`);
//   if (redis_res) {
//     res.status(200).json(JSON.parse(redis_res));
//   } else {
//     pool.query(
//       "SELECT pages.*,posts.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts_ep>pages.pages_last_ep-1 ORDER BY pages.pages_last_update ASC;",
//       async (err, result) => {
//         try {
//           if (err) {
//             console.log(err);
//           } else {
//             if (result.length === 0) {
//               res.status(404).json({ message: "Not Found" });
//             }
//             await redisclient.set(
//               `/last_updated`,
//               JSON.stringify(result),
//               "EX",
//               60
//             );
//             let data = await redisclient.get(`/last_updated`);
//             res.status(200).json(JSON.parse(data));
//           }
//         } catch (err) {
//           console.log(err);
//           res.status(500).json({ message: "Internal Server Error" });
//         }
//       }
//     );
//   }
// });

router.post("/pages/:slug", async (req, res) => {
  pool.query(
    `SELECT tags.* FROM pages INNER JOIN pages_tags ON pages_tags.pages_id=pages.pages_id INNER JOIN tags ON tags.tags_id=pages_tags.tags_id where pages.pages_slug=? ORDER BY tags.tags_name ASC;`,
    [req.params.slug],
    async (err, result) => {
      try {
        if (err) {
          console.log(`public/pages/` + err);
        } else {
          if (result.length === 0) {
            res.status(404).json({ message: "Page Url Not Found !" });
          } else {
            res.status(200).json({"pages_tags":result});
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
