require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const crypto = require("crypto");
const multerS3 = require("multer-s3");
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${crypto.randomBytes(15).toString("hex")}.png`);
//   },
// });

// var uploads = multer({ storage: storage });
const spacesEndpoint = new aws.Endpoint("sgp1.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO00FLU439PWPJEABC72",
  secretAccessKey: "CYHobUPR4PBxJT0wG2mpYwSjRfmaO5ny0s/u5RpcgSo",
});
// Change bucket property to your Space name
const uploads_pages = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "uploads-storage/uploads",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      console.log(file.mimetype);
      if (file.mimetype.includes("png")) {
        console.log("type file png");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.png`);
      } else if (file.mimetype.includes("gif")) {
        console.log("type file gif");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.gif`);
      } else if (file.mimetype.includes("webp")) {
        console.log("type file webp");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.webp`);
      } else if (file.mimetype.includes("jpg")) {
        console.log("type file jpg");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.jpg`);
      }else {
        cb(null, true);
      }
      // cb(null, true);
      //use Date.now() for unique file keys
    },
  }),
}).array("uploads_pages_thumbnail", 5);

const uploads_posts = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "uploads-storage/uploads",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      console.log(file.mimetype);
      if (file.mimetype.includes("png")) {
        console.log("type file png");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.png`);
      } else if (file.mimetype.includes("gif")) {
        console.log("type file gif");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.gif`);
      } else if (file.mimetype.includes("webp")) {
        console.log("type file webp");
        cb(null, `${crypto.randomBytes(15).toString("hex")}.webp`);
      } else {
        cb(null, true);
      }
      // cb(null, true);
      //use Date.now() for unique file keys
    },
  }),
}).array("uploads_posts_images", 100);
//!!!! Config Max File Size
const uploads_posts_delete = (keyname, req, res) => {
  const params = {
    Bucket: "uploads-storage",
    Delete: {
      Objects: keyname,
    },
  };

  s3.deleteObjects(params, (err, data) => {
    if (err) {
      console.log("เกิดข้อผิดพลาดในการลบไฟล์:", err);
      return res.status(500).json({ message: "File deleted Error" });
    } else if (data.Deleted.length === 0) {
      console.log("ไม่พบไฟล์ที่ต้องการลบ");
      return res.status(201).json({ message: "Not Found File deleted" });
    } else {
      return res.status(200).json({ message: "File deleted successfully" });
    }
  });
};

const uploads = {
  uploads_pages,
  uploads_posts,
  uploads_posts_delete,
};

module.exports = uploads;
