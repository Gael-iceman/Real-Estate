const mysql = require("mysql2/promise");

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER,
  DB_PASSWORD = "",
  DB_NAME
} = process.env;

if (!DB_USER || !DB_NAME) {
  throw new Error("Missing DB_USER or DB_NAME env vars");
}

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

// Test connection and log result
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully to:', DB_NAME);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;

