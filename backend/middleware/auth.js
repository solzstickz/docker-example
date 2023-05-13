const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const token = require("../middleware/token");

const admin = {
  user: "Superuser",
  pass: "Skzqqwwee44$$",
};
router.get("/", async (req, res) => {});

router.post("/create_token", async (req, res) => {
  const { username, password, api_key } = req.body;
  if (username == admin.user && password == admin.pass) {
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
      expiresIn: "1800s",
    });
    res.status(200).json({ token, role: "admin_username" });
  } else {
    if (api_key == process.env.API_KEY) {
      const token = jwt.sign({ api_key }, process.env.TOKEN_SECRET, {
        expiresIn: "99999999s",
      });
      res.status(200).json({ token, role: "admin_api_key" });
    } else {
      res.status(401).json("Not allowed Token not access authorized ");
    }
  }
});

module.exports = router;
