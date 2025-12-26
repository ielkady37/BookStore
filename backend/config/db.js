// backend/config/db.js
const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ SQL Database Connected Successfully");
    return pool;
  })
  .catch((err) => console.error("❌ Database Connection Failed:", err));

module.exports = { sql, poolPromise };
