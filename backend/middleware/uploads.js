require("dotenv").config();
const aws = require('aws-sdk');
const multer = require("multer");
const crypto = require("crypto");
const multerS3 = require('multer-s3');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${crypto.randomBytes(15).toString("hex")}.png`);
//   },
// });

// var uploads = multer({ storage: storage });
const spacesEndpoint = new aws.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId:'DO00FLU439PWPJEABC72',
  secretAccessKey:'CYHobUPR4PBxJT0wG2mpYwSjRfmaO5ny0s/u5RpcgSo'
});
// Change bucket property to your Space name
const uploads =  multer({
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
        }else if (file.mimetype.includes("webp")) {
          console.log("type file gif");
          cb(null, `${crypto.randomBytes(15).toString("hex")}.webp`);
        } else {
          cb(null, true);
        }
        // cb(null, true);
        //use Date.now() for unique file keys
      },
    }),
  }).array('uploads_pages_thumbnail', 5);




module.exports = uploads;
