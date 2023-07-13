const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const _ = require("lodash");
const multer = require("multer");
const crypto = require("crypto");
const uploads = require("../middleware/uploads");
const moment = require("moment");
const axios = require("axios");
const redis_server = require("../module/server_redis");
const { sendWebhookMessageServer } = require('../middleware/discord_hook');

//! domain.com/pages/
router.get("/pages/", async (req, res) => {
  let redis_key = "public:pages";
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    console.log("not found");
    pool.query("SELECT * FROM `pages`;", async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          // await  redisclient.sendCommand(['SET','peng' ,JSON.stringify(result),'EX','60']).then((result,err) => {});
          await redis_server.set(redis_key, result);
          let data = await redisclient.get(redis_key);
          res.status(200).json(JSON.parse(data));
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  }
});

router.get("/last_updated", async (req, res) => {
  let redis_key = "public:last_updated";
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    res.status(500).json({ message: "Internal Server" });
  }
});

router.get("/sitemap/pages/slug", async (req, res) => {
  let redis_key = "public:/sitemap/pages/slug";
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    pool.query(
      "SELECT pages.pages_slug FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts.posts_ep=pages.pages_last_ep ORDER BY pages.pages_id ASC;",
      async (err, result) => {
        try {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              res.status(200).json({ message: "Not Found" });
            } else {
              await redis_server.set(redis_key, result);
              let data = await redisclient.get(redis_key);
              res.status(200).json(JSON.parse(data));
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

router.get("/sitemap/tags/slug", async (req, res) => {
  let redis_key = "public:/sitemap/tags/slug";
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    pool.query(
      "SELECT tags.tags_slug FROM tags ORDER BY tags_id ASC",
      async (err, result) => {
        try {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              res.status(200).json({ message: "Not Found" });
            } else {
              await redis_server.set(redis_key, result);
              let data = await redisclient.get(redis_key);
              res.status(200).json(JSON.parse(data));
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

router.get("/sitemap/posts/slug", async (req, res) => {
  let redis_key = "public:/sitemap/posts/slug";
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    pool.query(
      "SELECT posts.posts_slug FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id ORDER BY posts_id ASC;",
      async (err, result) => {
        try {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              res.status(200).json({ message: "Not Found" });
            } else {
              await redis_server.set(redis_key, result);
              let data = await redisclient.get(redis_key);
              res.status(200).json(JSON.parse(data));
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

router.get("/search/:slug", async (req, res) => {
  pool.query(
    `SELECT pages.pages_slug,pages.pages_thumbnail,pages.pages_title,pages.pages_en,pages.pages_th,pages.pages_simple,pages.pages_last_update,pages.pages_type FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where (posts.posts_ep=pages.pages_last_ep AND pages.pages_en LIKE '%${req.params.slug}%') OR (posts.posts_ep=pages.pages_last_ep AND pages.pages_th LIKE '%${req.params.slug}%') ORDER BY pages.pages_id ASC;`,
    async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          if (result.length === 0) {
            res.status(200).json({ message: "Not Found" });
          } else {
            res.status(200).json(result);
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
});

//! domain.com/pages/:slug
router.get("/pages/:slug", async (req, res) => {
  let redis_key = `public:pages/${req.params.slug}`;
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    pool.query(
      `SELECT
      posts.posts_slug, posts.posts_ep, posts.posts_create
  FROM 
      posts
  INNER JOIN
      pages ON posts.pages_id = pages.pages_id
  WHERE 
      pages.pages_slug = ?
  ORDER BY 
      posts.posts_ep DESC`,
      [req.params.slug],
      async (err, result_posts) => {
        try {
          if (err) {
            console.log(`public/pages/` + err);
          } else {
            if (result_posts.length === 0) {
              res.status(200).json({ message: "Page Url Not Found !" });
            } else {
              pool.query(
                `SELECT tags.tags_slug,tags.tags_name FROM pages INNER JOIN pages_tags ON pages_tags.pages_id=pages.pages_id INNER JOIN tags ON tags.tags_id=pages_tags.tags_id where pages.pages_slug=? ORDER BY tags.tags_name ASC;`,
                [req.params.slug],
                async (err, result_tags) => {
                  try {
                    if (err) {
                      console.log(`public/pages/` + err);
                    } else {
                      if (result_tags.length === 0) {
                        res
                          .status(200)
                          .json({ message: "Page Url Not Found !" });
                      } else {
                        pool.query(
                          `SELECT
                          pages.pages_slug, pages.pages_view, pages.pages_last_update, pages.pages_status_showing,
                          pages.pages_last_ep, pages.pages_en, pages.pages_th, pages.pages_star,
                          pages.pages_type, pages.pages_follow, pages.pages_publish, pages.pages_title,
                          pages.pages_simple, pages.pages_thumbnail, pages.pages_description
                      FROM 
                          posts
                      INNER JOIN
                          pages ON posts.pages_id = pages.pages_id
                      WHERE 
                          pages.pages_slug = ?
                      ORDER BY 
                          posts.posts_ep DESC LIMIT 1;`,
                          [req.params.slug],
                          async (err, result_pages) => {
                            try {
                              if (err) {
                                console.log(`public/pages/` + err);
                              } else {
                                if (result_tags.length === 0) {
                                  res
                                    .status(200)
                                    .json({ message: "Page Url Not Found !" });
                                } else {
                                  let full_data = {
                                    pages: result_pages,
                                    tags: result_tags,
                                    posts:result_posts
                                  };
                                  await redis_server.set(redis_key, full_data);
                                  let data = await redisclient.get(redis_key);
                                  res.status(200).json(JSON.parse(data));
                                }
                              }
                            } catch (err) {
                              console.log(err);
                              res.status(500).json({ message: "Internal Server Error" });
                            }
                          }
                        );
                      }
                    }
                  } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: "Internal Server Error" });
                  }
                }
              );
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

router.get("/posts/:slug", async (req, res) => {
  let redis_key = `public:posts/${req.params.slug}`;
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    pool.query(
      `SELECT pages.pages_slug,pages.pages_en,pages.pages_th,pages.pages_status_showing,posts.posts_slug,posts.posts_ep,posts.posts_detail FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id WHERE posts.posts_slug = ? ;`,
      [req.params.slug],
      async (err, result_posts) => {
        try {
          if (err) {
            console.log(`public/result_posts/` + err);
          } else {
            if (result_posts.length === 0) {
              res.status(200).json({ message: "Page Url Not Found !" });
            } else {
              await redis_server.set(redis_key, result_posts);
              let data = await redisclient.get(redis_key);
              res.status(200).json(JSON.parse(data));
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

router.get("/tags/:slug", async (req, res) => {
  let redis_key = `public:tags/${req.params.slug}`;
  let redis_res = await redisclient.get(redis_key);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res));
    console.log("found");
  } else {
    pool.query(
      "SELECT pages.pages_slug,pages.pages_thumbnail,pages.pages_title,pages.pages_en,pages.pages_last_update,pages.pages_type,pages.pages_last_ep,posts.posts_slug,tags.tags_slug,tags.tags_name FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id INNER JOIN pages_tags ON pages.pages_id = pages_tags.pages_id INNER JOIN tags ON pages_tags.tags_id=tags.tags_id  where posts.posts_ep=pages.pages_last_ep and tags.tags_slug='action' ORDER BY pages.pages_last_update DESC;",
      [req.params.slug],
      async (err, result) => {
        try {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              res.status(200).json({ message: "Not Found" });
            } else {
              await redis_server.set(redis_key, result);
              let data = await redisclient.get(redis_key);
              res.status(200).json(JSON.parse(data));
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
  }
});

(async () => {
  getLastUpdatedReload();
  getTagsPopular();
  setInterval(getLastUpdatedReload, 60000);
  setInterval(getTagsPopular, 60000);
  // setInterval(sendWebhookMessageServer, 6000);
})();

async function getLastUpdatedReload() {
  let redis_key = "public:last_updated";
  pool.query(
    "SELECT pages.pages_slug,pages.pages_thumbnail,pages.pages_title,pages.pages_en,pages.pages_last_update,pages.pages_type,pages.pages_last_ep,posts.posts_slug FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id where posts.posts_ep=pages.pages_last_ep ORDER BY pages.pages_last_update DESC LIMIT 100;",
    async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          if (result.length === 0) {
            console.log({ message: "Not Found" });
          } else {
            await redis_server.set(redis_key, result);
          }
        }
      } catch (err) {
        console.log(err);
        console.log({ message: "Internal Server Error" });
      }
    }
  );
}

async function getTagsPopular() {
  let redis_key = `public:tags/popular`;
  pool.query(
    "SELECT pages.pages_slug,pages.pages_simple,pages.pages_thumbnail,pages.pages_title,pages.pages_en,pages.pages_th,pages.pages_last_update,pages.pages_type,pages.pages_last_ep,posts.posts_slug,tags.tags_slug,tags.tags_name FROM posts INNER JOIN pages ON posts.pages_id = pages.pages_id INNER JOIN pages_tags ON pages.pages_id = pages_tags.pages_id INNER JOIN tags ON pages_tags.tags_id=tags.tags_id  where posts.posts_ep=pages.pages_last_ep and tags.tags_slug=? ORDER BY pages.pages_last_update DESC;",
    ["popular"],
    async (err, result) => {
      try {
        if (err) {
          console.log(err);
        } else {
          if (result.length === 0) {
            console.log({ message: "Not Found" });
          } else {
            await redis_server.set(redis_key, result);
          }
        }
      } catch (err) {
        console.log(err);
        console.log({ message: "Internal Server Error" });
      }
    }
  );
}

module.exports = router;
