const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 7777;
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
app.use(cors());
app.use(bodyParser.json());

//! Routes
app.get("/", async (req, res) => {
  var get_value = await redisclient.get("user_details");
  if (get_value) {
    res.status(200).json(JSON.parse(get_value));
    console.log("send__redis");
  } else {
    conn_db.query(
      "SELECT * FROM `user_details` LIMIT 30000;",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          redisclient.set("user_details", JSON.stringify(result));
          res.status(200).json(result);
          console.log("send__mysql");
        }
      }
    );
  }
});

//! Server Running
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
