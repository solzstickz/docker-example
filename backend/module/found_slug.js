const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const pool = require("../config/mysql");
require("dotenv").config();

module.exports = {
    async found_pages_slug(pages_slug) {
        return new Promise((resolve, reject) => {
          pool.query(
            "SELECT * FROM pages WHERE pages_slug = ?",
            [pages_slug],
            (err, result_slug_found) => {
              if (err) {
                console.log("Status Mysql Insert Error", err);
                reject(err);
              } else {
                if (result_slug_found.length > 0) {
                    resolve({ status: true,pages_id : result_slug_found[0].pages_id });
                } else {
                    resolve({ status: false,pages_id : 'false'});
                }
              }
            }
          );
        });
      },
      async found_posts_slug(pages_slug) {
        return new Promise((resolve, reject) => {
          pool.query(
            "SELECT * FROM posts WHERE posts_slug = ?",
            [pages_slug],
            (err, result_slug_found) => {
              if (err) {
                console.log("Status Mysql Insert Error", err);
                reject(err);
              } else {
                if (result_slug_found.length > 0) {
                    resolve({ status: true,posts_id : result_slug_found[0].posts_id });
                } else {
                    resolve({ status: false,posts_id : 'false'});
                }
              }
            }
          );
        });
      },
};
