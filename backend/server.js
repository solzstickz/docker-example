const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
require("dotenv").config();

const port = process.env.SERVER_PORT;

const redisclient = require("./redis");
const conn_db = require("./mysql");

//! Redis Connection
redisclient.on("ready", () => {
  console.log("Connected! to the Redis successfully");
});

redisclient.on("error", (err) => {
  console.log("Error in the Connection to the Redis" + err);
});

//! setting up the express app

//! Routes

app.get("/", async (req, res) => {
  let redis_res = await redisclient.get("index:res"); 
  console.log(redis_res);
  if (redis_res) {
    res.status(200).json(JSON.parse(redis_res)); 
    console.log("send from redis");
  } else {
    conn_db.query("SELECT * FROM `pages`;", async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result" + result);
        await redisclient.set("index:res", JSON.stringify(result), "EX", 60);
        let data = await redisclient.get("index:res");
        console.log("send from mysql");
        res.status(200).json(JSON.parse(data));
      }
    });
  }
});



//! Server Running
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//soket io

// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//   path: "/index/",
//   cors: {
//     origin: "*",
//     transports: ["websocket", "polling"],
//   },
// });

// io.on("connect", (client) => {
//   console.log("index connected");
//   // เมื่อ Client ตัดการเชื่อมต่อ
//   client.on("disconnect", () => {
//     console.log("index disconnected");
//   });
//   // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
//   client.on("index:req", async () => {
//     let redis_res = await redisclient.get("index:res");
//     if (redis_res) {
//       io.emit("index:res", JSON.parse(redis_res));
//     } else {
//       conn_db.query("SELECT * FROM `pages`;", async (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           await redisclient.set("index:res", JSON.stringify(result));
//           await redisclient.expire("index:res", 60);
//           io.emit("index:res", result);
//         }
//       });
//     }
//   });
// });
// server.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
