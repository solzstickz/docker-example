const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');
const pool = require("../config/mysql");
const uploads = require("../middleware/uploads");
const found_slug = require('./found_slug');
require("dotenv").config();



module.exports = {
    async create_pages(req,res) {
        const check_slug = await found_slug.found_pages_slug(req.body.pages_slug);
        console.log(check_slug);
        let reqbody_tags = await req.body.pages_tags;
        let reqbody_pages = await req.body;
        console.log(reqbody_pages);
        delete reqbody_pages.pages_tags;
        const formatdatetime = "YYYY-MM-DD HH:mm:ss";
        const formatdateyear = "YYYY";
        reqbody_pages.pages_last_update = moment().tz('Asia/Bangkok').format(formatdatetime);
        reqbody_pages.pages_publish = moment().tz('Asia/Bangkok').format(formatdateyear);
        if(check_slug.status == true){
          res.status(201).json({ message: "Pages already exist" });
        }else{
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
                          let data_img = { fk_pages_posts_id:result.insertId,type:1,description:`slug->>${reqbody_pages.pages_slug}->>pages_thumbnail_date->>${reqbody_pages.pages_last_update}`};
                          pool.query(`UPDATE img_found set ? WHERE url = ?`,[data_img,reqbody_pages.pages_thumbnail], async (err, result_img_found) => {
                            try {
                              if (err) {
                                console.log("Status Mysql Insert Error",err);
                                res.status(500).json({ message: "Status Mysql Update img_found Error" });
                              }else{
                                if (result_img_found.affectedRows > 0){
                                  res.status(200).json({ message : "Status Insert Success"});
                                }else{
                                  res.status(201).json({ message: "Status Update img_found Error" });
                                }
                              }
                            }catch (err) {
                              console.log(err);
                              res.status(500).json({ message: "Internal Server Error" });
                            }
                          })
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
        }
    },

    async slug_pages(req,res){
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
                    // const formatdatetime = "YYYY-MM-DD HH:mm:ss"
                    // console.log(moment().tz('Asia/Bangkok').format(formatdatetime));
                    // data[0].pages_last_update = moment(data[0].pages_last_update).tz('Asia/Bangkok').format(formatdatetime)
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
                    delete data[0].tags_slug_all;
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
    },

    async delete_pages(req,res){
        let reqbody = await req.body;
        var data_value  = await reqbody.map(head => head.pages_id);
        pool.query(`DELETE FROM posts where pages_id in (?)`,[data_value], async (err, result_delete_post) => {
          try {
            if (err) {
              console.log("Status Mysql Insert Error",err);
              res.status(500).json({ message: "Status Mysql Update img_found Error" });
            }else{
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
                              pool.query(`UPDATE img_found set type = 0 WHERE fk_pages_posts_id = ? and type = 1`,[data_value], async (err, result_img_found) => {
                                try {
                                  if (err) {
                                    console.log("Status Mysql Insert Error",err);
                                    res.status(500).json({ message: "Status Mysql Update img_found Error" });
                                  }else{
                                    if (result_img_found.affectedRows > 0){
                                      // await uploads.uploads_posts_delete(keyname,req,res);
                                      res.status(200).json({ message : "Status Update img_found Success"});
                                    }else{
                                      res.status(201).json({ message: "Status Update img_found not found" });
                                    }
                                  }
                                }catch (err) {
                                  console.log(err);
                                  res.status(500).json({ message: "Internal Server Error" });
                                }
                              })
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
            }
          }catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
          }
        })
    },

    async edit_pages(req,res){
        const check_slug = await found_slug.found_pages_slug(req.body.pages_slug);
        console.log(check_slug);
        let reqbody_tags = await req.body.pages_tags;
        let reqbody_pages = await req.body;
        const pages_id = await reqbody_pages.pages_id;
        const formatdatetime = "YYYY-MM-DD HH:mm:ss"
        const formatdateyear = "YYYY"
        delete reqbody_pages.pages_id;
        delete reqbody_pages.pages_tags;
        reqbody_pages.pages_last_update = moment().tz('Asia/Bangkok').format(formatdatetime);
        reqbody_pages.pages_publish = moment().tz('Asia/Bangkok').format(formatdateyear);
        if(check_slug.status == true && check_slug.pages_id != pages_id){
          res.status(201).json({ message: "Pages already exist" });
        }else{
          pool.query(`UPDATE pages set ? WHERE pages_id = ?`,[reqbody_pages,pages_id], async (err, result_pages) => {
            try {
              if (err) {
                  console.log(`Status Mysql Update Error` + err);
                  res.status(500).json({ message: "Status Mysql Update Error" });
              } else {
                pool.query(`DELETE FROM pages_tags where pages_id in (?)`,[pages_id], async (err, result_pages_tags_delete) => {
                  try {
                    if (err) {
                      console.log("Status Mysql Insert Error",err);
                      res.status(500).json({ message: "Status Mysql Delete Pages_tags Error" });
                    }else{
                    let new_tags = reqbody_tags.map((tags) => {
                       return  {"tags_id":tags.tags_id,"pages_id":pages_id}
                   })
                   //  new_tags = JSON.stringify(new_tags);
                   console.log(new_tags);
                   const values = new_tags.map((item) => [item.tags_id, item.pages_id]);
                   pool.query(`INSERT INTO pages_tags (tags_id,pages_id) values ?`,[values], async (err, result_pages_tags_insert) => {
                     try {
                       if (err) {
                         console.log("Status Mysql Insert Error",err);
                         res.status(500).json({ message: "Status Mysql Insert Pages_tags Error" });
                       }else{
                        if (result_pages_tags_insert.insertId > 0){
                          pool.query(`UPDATE img_found SET type = 0 WHERE fk_pages_posts_id = ? and type = 1`,[pages_id], async (err, result_img_found_1) => {
                            try {
                              if (err) {
                                console.log("Status Mysql Insert Error",err);
                                res.status(500).json({ message: "Status Mysql Update img_found_to_zero Error" });
                              }else{
                                    let data_img = { fk_pages_posts_id:pages_id,type:1,description:`slug->>${reqbody_pages.pages_slug}->>pages_thumbnail_date->>${reqbody_pages.pages_last_update}`};
                                    pool.query(`UPDATE img_found set ? WHERE url = ?`,[data_img,reqbody_pages.pages_thumbnail], async (err, result_img_found) => {
                                      try {
                                        if (err) {
                                          console.log("Status Mysql Insert Error",err);
                                          res.status(500).json({ message: "Status Mysql Update img_found Error" });
                                        }else{
                                          if (result_img_found.affectedRows > 0){
                                            res.status(200).json({ message : "Status Update Success"});
                                          }else{
                                            res.status(201).json({ message: "Status Update img_found Error" });
                                          }
                                        }
                                      }catch (err) {
                                        console.log(err);
                                        res.status(500).json({ message: "Internal Server Error" });
                                      }
                                    })
                              }
                            }catch (err) {
                              console.log(err);
                              res.status(500).json({ message: "Internal Server img_found_to_zero Error" });
                            }
                          })
                         }else{
                           res.status(201).json({ message: "Status Insert Pages_tags Error" });
                         }
                       }
                     }catch (err) {
                       console.log(err);
                       res.status(500).json({ message: "Internal Server Error" });
                     }
                   });
                    }
                  }catch (err) {
                    console.log(err);
                    res.status(500).json({ message: "Internal Server Pages_tags Error" });
                  }
                });
              }
            } catch (err) {
              console.log(err);
              res.status(500).json({ message: "Internal Server Error" });
            }
          });
        }
    }

};