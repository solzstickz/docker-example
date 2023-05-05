const mysql = require("mysql2");
//! create the connection to database
const config = {
  host: "192.168.65.5",
  port: 3306,
  user: "skz",
  password: "skzz",
  database: "app_db",
};
const conn_db = mysql.createConnection(config);
module.exports = conn_db;
