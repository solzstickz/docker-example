const redis = require("redis");
require("dotenv").config();
const redisclient = redis.createClient({
  socket: {
    // host: "redis-server",
    // port: 6379,
    host: process.env.IP_SERVER_REDIS,
    port: process.env.PORT_SERVER_REDIS,
  },
});

(async () => {
  await redisclient.connect();
})();
//! Redis Connection
redisclient.on("ready", async () => {
  console.log("Connected! to the Redis successfully");
});
redisclient.on("error", async (err) => {
  console.log("Error in the Connection to the Redis" + err);
});

module.exports = redisclient;
