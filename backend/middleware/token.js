const jwt = require("jsonwebtoken");
const redisclient = require("../config/redis");
const { config } = require("dotenv");
require("dotenv").config();

const generateAccessToken = async (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "57600s" });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(400).json({ message: "Token is null?" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token is invalid" });

    req.user = user;

    next();
  });
}

const token = {
  generateAccessToken,
  authenticateToken,
};

module.exports = token;
