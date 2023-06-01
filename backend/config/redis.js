const redis = require("redis");
require("dotenv").config();
// const redisclient = redis.createClient({
//   socket: {
//     host: "redis-server",
//     port: 6379,
//     host: process.env.IP_SERVER_REDIS,
//     port: process.env.PORT_SERVER_REDIS,
//     username: process.env.USERNAME_SERVER_REDIS,
//     password: process.env.PASSWORD_SERVER_REDIS,
//     username: "default",
//     password: "AVNS_eng3wy5JoJBnrdNsue0",
//     host: "db-redis-sg-do-user-14170803-0.b.db.ondigitalocean.com",
//     port: "25061",
//   },
// }
// });
const redisclient = redis.createClient({
  url: "rediss://default:AVNS_eng3wy5JoJBnrdNsue0@db-redis-sg-do-user-14170803-0.b.db.ondigitalocean.com:25061",
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
