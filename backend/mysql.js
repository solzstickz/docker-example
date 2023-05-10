const mysql = require("mysql2");
//! create the connection to database
const config = {
  // host: "mysql",
  // port: 3306,
  // user: "skz",
  // password: "skzz",
  // database: "app_db",
  host: process.env.IP_MYSQL,
  port: process.env.PORT_MYSQL,
  user: process.env.USER_MYSQL,
  password: process.env.PASSWORD_MYSQL,
  database: process.env.DATABASE_MYSQL,
};
const conn_db = mysql.createConnection(config);
conn_db.connect((err) => {
  if (err) {
    console.log("Error in the Connection to the MySQL" + err);
  } else {
    console.log("Connected! to the MySQL successfully");
  }
});
module.exports = conn_db;
