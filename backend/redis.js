const redis = require("redis");
const redisclient = redis.createClient({
  socket: {
    host: "192.168.65.3",
    port: 6379,
  },
});

(async () => {
  await redisclient.connect();
})();

module.exports = redisclient;
