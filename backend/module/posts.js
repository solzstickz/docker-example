const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const pool = require("../config/mysql");
const found_slug = require('./found_slug');
require("dotenv").config();

module.exports = {
  async create_posts(req, res) {
    let reqbody = await req.body;
    const check_slug = await found_slug.found_posts_slug(req.body.posts_slug);
    console.log(check_slug);
    if(check_slug.status === true) {
      res.status(201).json({ message: "Posts already exist" });
    }else{
    const pages_slug = req.body.pages_slug;
    const posts_detail = req.body.posts_detail;
    delete reqbody.pages_slug;
    console.log(reqbody);
    const formatdatetime = "YYYY-MM-DD HH:mm:ss";
    reqbody.posts_create = moment().tz("Asia/Bangkok").format(formatdatetime);
    pool.query(
      `SELECT * FROM pages where pages_slug=? ORDER BY pages_last_update DESC LIMIT 1;`,
      [pages_slug],
      async (err, result_pages_id) => {
        try {
          if (err) {
            console.log("Status Mysql Insert Error", err);
            res
              .status(500)
              .json({ message: "Status Mysql Select Pages_slug Error" });
          } else {
            if (result_pages_id.length > 0) {
              reqbody.pages_id = result_pages_id[0].pages_id;
              console.log(result_pages_id);
              for (i in reqbody.posts_detail) {
                let alt = `${pages_slug}-ตอนที่-${reqbody.posts_ep}-${reqbody.posts_detail[i].image_no}`;
                reqbody.posts_detail[i].alt = alt;
              }
              reqbody.posts_detail = JSON.stringify(reqbody.posts_detail);
              console.log(reqbody);
              pool.query(
                `INSERT INTO posts set ?`,
                [reqbody],
                async (err, result) => {
                  try {
                    if (err) {
                      console.log("Status Mysql Insert Error", err);
                      res
                        .status(500)
                        .json({ message: "Status Mysql Posts Insert Error" });
                    } else {
                      if (result.insertId > 0) {
                        pool.query(
                          `UPDATE pages set pages_last_update = ?, pages_last_ep = ? WHERE pages_id = ?`,
                          [
                            reqbody.posts_create,
                            reqbody.posts_ep,
                            reqbody.pages_id,
                          ],
                          async (err, result_update_last_ep) => {
                            try {
                              if (err) {
                                console.log("posts/:slug" + err);
                                res.status(500).json({
                                  message: "Internal Mysql Pages Server Error",
                                });
                              } else {
                                if (result_update_last_ep.changedRows > 0) {
                                  let countcheck = 0;
                                  console.log(posts_detail.length);
                                  for(x in posts_detail){
                                    let data_for = {
                                      fk_pages_posts_id: result.insertId,
                                      type: 2,
                                      description: `slug->>${reqbody.posts_slug}->>posts_image_รูปที่_${posts_detail[x].image_no}_date->>${reqbody.posts_create}`,
                                    };
                                    console.log(data_for);
                                    pool.query(
                                      `UPDATE img_found set ? WHERE url = ?`,
                                      [data_for, posts_detail[x].url],
                                      async (err, result_img_found) => {
                                        try {
                                          if (err) {
                                            console.log(
                                              "Status Mysql Insert Error",
                                              err
                                            );
                                            res.status(500).json({
                                              message:
                                                "Status Mysql Update img_found Error",
                                            });
                                          } else {
                                            countcheck ++;
                                            if (
                                              result_img_found.affectedRows > 0
                                            ) {
                                              if (countcheck == posts_detail.length) {
                                                res.status(200).json({
                                                  message: "Status Create Success",
                                                });
                                              }
                                            } else {
                                              res.status(201).json({
                                                message:
                                                  "Status Update img_found Error",
                                              });
                                            }
                                          }
                                        } catch (err) {
                                          console.log(err);
                                          res.status(500).json({
                                            message: "Internal Server Error",
                                          });
                                        }
                                      }
                                    );
                                  }
                                } else {
                                  res.status(201).json({
                                    message: "Post Update Not Found !",
                                  });
                                }
                              }
                            } catch (err) {
                              console.log(err);
                              res
                                .status(500)
                                .json({ message: "Internal Server Error" });
                            }
                          }
                        );
                      } else {
                        res
                          .status(201)
                          .json({ message: "Status Posts Insert Not found" });
                      }
                    }
                  } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: "Internal Server Error" });
                  }
                }
              );
            } else {
              res.status(201).json({ message: "Status Pages_slug Not_found" });
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
    }
  },
  async edit_posts(req, res) {
    let data = await req.body;
    const posts_id = await data.posts_id;
    const check_slug = await found_slug.found_posts_slug(data.posts_slug);
    console.log(check_slug);
    if(check_slug.status == true && check_slug.posts_id != posts_id) {
      res.status(201).json({ message: "Posts already exist" });
    }else{
      const formatdatetime = "YYYY-MM-DD HH:mm:ss";
      const posts_detail = req.body.posts_detail;
      data.posts_create = moment().tz("Asia/Bangkok").format(formatdatetime);
      for (i in data.posts_detail) {
        let alt = `${data.posts_slug}-ตอนที่-${data.posts_ep}-${data.posts_detail[i].image_no}`;
        data.posts_detail[i].alt = alt;
      }
      data.posts_detail = JSON.stringify(data.posts_detail);
      delete data.posts_id;
      pool.query(
        `UPDATE posts set ? WHERE posts_id = ?`,
        [data, posts_id],
        async (err, result) => {
          try {
            if (err) {
              console.log("posts/:slug" + err);
              res
                .status(500)
                .json({ message: "Internal Mysql Posts Server Error" });
            } else {
              if (result.changedRows > 0) {
                console.log("Status Update Posts Success");
                pool.query(
                  `UPDATE pages set pages_last_update = ?, pages_last_ep = ? WHERE pages_id = ?`,
                  [data.posts_create, data.posts_ep, data.pages_id],
                  async (err, result) => {
                    try {
                      if (err) {
                        console.log("posts/:slug" + err);
                        res
                          .status(500)
                          .json({ message: "Internal Mysql Pages Server Error" });
                      } else {
                        if (result.changedRows > 0) {
                            let countcheck = 0;
                            console.log(posts_detail.length);
                            for(x in posts_detail){
                              let data_for = {
                                fk_pages_posts_id: posts_id,
                                type: 2,
                                description: `slug->>${data.posts_slug}->>posts_image_รูปที่_${posts_detail[x].image_no}_date->>${data.posts_create}`,
                              };
                              console.log(data_for);
                              pool.query(
                                `UPDATE img_found set ? WHERE url = ?`,
                                [data_for, posts_detail[x].url],
                                async (err, result_img_found) => {
                                  try {
                                    if (err) {
                                      console.log(
                                        "Status Mysql Insert Error",
                                        err
                                      );
                                      res.status(500).json({
                                        message:
                                          "Status Mysql Update img_found Error",
                                      });
                                    } else {
                                      countcheck ++;
                                      if (
                                        result_img_found.affectedRows > 0
                                      ) {
                                        if (countcheck == posts_detail.length) {
                                          res
                            .status(200)
                            .json({ message: "Status Posts Update Success" });
                                        }
                                      } else {
                                        res.status(201).json({
                                          message:
                                            "Status Update img_found Error",
                                        });
                                      }
                                    }
                                  } catch (err) {
                                    console.log(err);
                                    res.status(500).json({
                                      message: "Internal Server Error",
                                    });
                                  }
                                }
                              );
                            }
                        } else {
                          res
                            .status(201)
                            .json({ message: "Pages Update Not Found !" });
                        }
                      }
                    } catch (err) {
                      console.log(err);
                      res.status(500).json({ message: "Internal Server Error" });
                    }
                  }
                );
              } else {
                res.status(201).json({ message: "Posts Url Not Found !" });
              }
            }
          } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
          }
        }
      );
    }
  },
  async delete_posts(slug, res,i,data_length) {
    let posts_id = slug;
    i = Number(i)+1;
    console.log(posts_id);
    console.log(i,data_length);
    pool.query(`SELECT posts.* FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE posts_slug = ? ORDER BY posts_ep DESC;`,[posts_id], async (err, result_posts) => {
      try {
        if (err) {
          console.log("Status Mysql Insert Error",err);
          res.status(500).json({ message: "Status Mysql result_posts Error" });
        }else{
          console.log(result_posts);
          if (result_posts.length > 0){
            // await uploads.uploads_posts_delete(keyname,req,res);
            pool.query(`DELETE FROM posts where posts_slug in (?)`,[posts_id], async (err, result) => {
              try {
                if (err) {
                  console.log("Status Delete pages Error",err);
                  res.status(500).json({ message: "Status Delete Posts Error" });
                } else {
                  if (result.affectedRows > 0){
                    pool.query(`UPDATE img_found set type = 0 WHERE fk_pages_posts_id = ? and type = 2`,[result_posts[0].posts_id], async (err, result_img_found) => {
                      try {
                        if (err) {
                          console.log("Status Mysql Insert Error",err);
                          res.status(500).json({ message: "Status Mysql Update img_found Error" });
                        }else{
                          if (result_img_found.affectedRows > 0){
                            // await uploads.uploads_posts_delete(keyname,req,res);
                            if(i == data_length){
                              res.status(200).json({ message : "Status Delete Posts Success"});
                            }
                          }else{
                            if(i == data_length){
                              res.status(200).json({ message: "Status Update img_found not found" });
                            }
                          }
                        }
                      }catch (err) {
                        console.log(err);
                        res.status(500).json({ message: "Internal Server Error" });
                      }
                    })
                  }else {
                    res.status(201).json({ message : "Status Delete Posts Not Found"});
                  }
                }
              } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Pages Error" });
              }
            });
          }else{
            res.status(201).json({ message: "Status Update result_posts not found" });
          }
        }
      }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })
  },
};
