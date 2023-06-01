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

  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
};
const pool = mysql.createPool(config);

//! MySQL Connection
pool.getConnection(async (err, connection) => {
  if (err) {
    console.log("Database connection was closed.");
  }
  if (connection) {
    console.log("Connected! to the Database successfully");
    connection.release();
  }
});

module.exports = pool;
