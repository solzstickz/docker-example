const redis = require("redis");
const redisclient = redis.createClient({
  url: "rediss://default:AVNS_eng3wy5JoJBnrdNsue0@db-redis-sg-do-user-14170803-0.b.db.ondigitalocean.com:25061",
});

(async () => {
  await redisclient.connect();
})();
//! Redis Connection
let Json = ({peng:'5555555'});
console.log(Json);
redisclient.on("ready", async () => {
  console.log("Connected! to the Redis successfully");
  let test = await  redisclient.sendCommand(['SET','peng' ,JSON.stringify(Json),'EX','60']).then((result,err) => {
    if (err) {
    } else {
    }
  });
  // let test = await redisclient.hGetAll('*');
  console.log(test);
});
redisclient.on("error", async (err) => {
  console.log("Error in the Connection to the Redis" + err);
});







module.exports = redisclient;