const { Pool } = require("pg");

// PostgreSQL connection pool for database operations
const pool = new Pool({
  user: "postgres",
  password: "anvesh",
  host: "localhost",
  port: 5432,
  database: "backend",
});

module.exports = pool;
