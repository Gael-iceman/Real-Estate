const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const schemaPath = path.join(__dirname, "..", "sql", "schema.sql");
const seedPath = path.join(__dirname, "..", "sql", "seed.sql");

async function run() {
  const {
    DB_HOST = "localhost",
    DB_PORT = "3306",
    DB_USER,
    DB_PASSWORD = "",
    DB_NAME
  } = process.env;

  if (!DB_USER || !DB_NAME) {
    console.error("Missing DB_USER or DB_NAME in .env");
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  await connection.query("CREATE DATABASE IF NOT EXISTS ??", [DB_NAME]);
  await connection.query("USE ??", [DB_NAME]);

  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  await connection.query(schemaSql);

  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, "utf8");
    if (seedSql.trim()) {
      await connection.query(seedSql);
    }
  }

  await connection.end();
  console.log("Database setup completed.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
