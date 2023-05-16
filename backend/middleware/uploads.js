require("dotenv").config();
const multer = require("multer");
const crypto = require("crypto");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${crypto.randomBytes(15).toString("hex")}.png`);
  },
});

var uploads = multer({ storage: storage });
module.exports = uploads;
