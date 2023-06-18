const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');
const pool = require("../config/mysql");
require("dotenv").config();



module.exports = {
    async create_posts(req,res) {
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
                          pool.query(
                            `UPDATE pages set pages_last_update = ?, pages_last_ep = ? WHERE pages_id = ?`,
                            [reqbody.posts_create,reqbody.posts_ep,reqbody.pages_id],
                            async (err, result_update_last_ep) => {
                              try {
                                if (err) {
                                  console.log("posts/:slug" + err);
                                  res.status(500).json({ message: "Internal Mysql Pages Server Error" });
                                } else {
                                  if(result_update_last_ep.changedRows > 0){
                                    res.status(200).json({ message: "Status Post Update Success" });
                                  }else{
                                    res.status(201).json({ message: "Post Update Not Found !" });
                                  }
                                }
                              } catch (err) {
                                console.log(err);
                                res.status(500).json({ message: "Internal Server Error" });
                              }
                            }
                          );
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
    },
    async edit_posts(req,res) {
      let data = await req.body;
      const posts_id = await data.posts_id;
      const formatdatetime = "YYYY-MM-DD HH:mm:ss"
      data.posts_create = moment().tz('Asia/Bangkok').format(formatdatetime);
      for(i in data.posts_detail){
        let alt =`${data.posts_slug}-ตอนที่-${data.posts_ep}-${data.posts_detail[i].image_no}`;
        data.posts_detail[i].alt = alt;
      }
      data.posts_detail = JSON.stringify(data.posts_detail)
      delete data.posts_id;
        pool.query(
          `UPDATE posts set ? WHERE posts_id = ?`,
          [data,posts_id],
          async (err, result) => {
            try {
              if (err) {
                console.log("posts/:slug" + err);
                res.status(500).json({ message: "Internal Mysql Posts Server Error" });
              } else {
                if(result.changedRows > 0){
                  console.log("Status Update Posts Success");
                  pool.query(
                    `UPDATE pages set pages_last_update = ?, pages_last_ep = ? WHERE pages_id = ?`,
                    [data.posts_create,data.posts_ep,data.pages_id],
                    async (err, result) => {
                      try {
                        if (err) {
                          console.log("posts/:slug" + err);
                          res.status(500).json({ message: "Internal Mysql Pages Server Error" });
                        } else {
                          if(result.changedRows > 0){
                            res.status(200).json({ message: "Status Posts Update Success" });
                          }else{
                            res.status(201).json({ message: "Pages Update Not Found !" });
                          }
                        }
                      } catch (err) {
                        console.log(err);
                        res.status(500).json({ message: "Internal Server Error" });
                      }
                    }
                  );
                }else{
                  res.status(201).json({ message: "Posts Url Not Found !" });
                }
              }
            } catch (err) {
              console.log(err);
              res.status(500).json({ message: "Internal Server Error" });
            }
          }
        );
  },
};