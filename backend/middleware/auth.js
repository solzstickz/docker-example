const express = require("express");
const router = express.Router();
const redisclient = require("../config/redis");
const pool = require("../config/mysql");
const jwt = require("jsonwebtoken");
const { sendWebhookMessage } = require('./discord_hook');
require("dotenv").config();
// const token = require("../middleware/token");
const admin = {
  user: "Superuser",
  pass: "Skzqqwwee44$$",
};
const author = {
  user: "Abatukumm",
  pass: "cadb53c2-f0b2-463c-8af5-68a8641b8571"
}
router.get("/", async (req, res) => {});

// router.post("/create_token", async (req, res) => {
//   const { username, password, api_key } = req.body;
//   if (username == admin.user && password == admin.pass) {
//     const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
//       expiresIn: "1800s",
//     });
//     res.status(200).json({ token, role: "admin_username" });
//   } else {
//     if (api_key == process.env.API_KEY) {
//       const token = jwt.sign({ api_key }, process.env.TOKEN_SECRET, {
//         expiresIn: "99999999s",
//       });
//       res.status(200).json({ token, role: "admin_api_key" });
//     } else {
//       res.status(401).json("Not allowed Token not access authorized ");
//     }
//   }
// });

router.post("/create_token", async (req, res) => {
  const { username, password, api_key } = req.body;
  if (username == admin.user && password == admin.pass) {
    sendWebhookMessage(`Admin_login`,process.env.IMG_ADMIN);
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
      expiresIn: "57600s",
    });
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        // sameSite: 'strict',
        // domain: 'peng.com',
        expires: new Date(Date.now() + 3600000),
      }).status(200).json({ access_token:token, role: "admin_api_key" });
  }else if (username == author.user && password == author.pass) {
    sendWebhookMessage(`Abatukumm_login`,process.env.IMG_AUTHOR);
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
      expiresIn: "57600s",
    });
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        // sameSite: 'strict',
        // domain: 'peng.com',
        expires: new Date(Date.now() + 3600000),
      }).status(200).json({ access_token:token, role: "author_api_key" });
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
