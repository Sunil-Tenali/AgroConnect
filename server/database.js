/**
 * PostgreSQL Connection Pool Configuration
 * 
 * Creates and manages a connection pool for the PostgreSQL database.
 * The pool handles connection reuse and lifecycle management efficiently.
 * 
 * Configuration:
 * - Reads credentials from environment variables for security
 * - Maintains persistent connections for performance
 * - Handles database errors gracefully with logging
 */

const { Pool } = require("pg");
require("dotenv").config();

// Create connection pool with environment-based configuration
// Uses connection pooling for efficient resource management
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "agroconnect",
});

// Log unexpected errors from the connection pool
// Helps diagnose database connectivity issues in production
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = pool;
