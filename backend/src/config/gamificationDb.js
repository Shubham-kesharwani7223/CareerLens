"use strict";
const { Pool } = require("pg");

const connectionString = String(process.env.GAMIFICATION_DATABASE_URL || "").trim();
let pool = null;

if (connectionString) {
  let isLocal = false;
  try {
    const parsed = new URL(connectionString);
    isLocal = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  } catch {
    // The Pool will surface a clearer connection error if the URL is malformed.
  }
  pool = new Pool({
    connectionString,
    ssl: isLocal || process.env.GAMIFICATION_DATABASE_SSL === "false"
      ? undefined
      : { rejectUnauthorized: false },
    max: Number.parseInt(process.env.GAMIFICATION_DB_POOL_MAX || "5", 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  pool.on("error", (error) => console.error("[Gamification PostgreSQL] Pool error:", error.message));
}

function getGamificationPool() {
  if (!pool) {
    const error = new Error("Gamification SQL is not configured. Set GAMIFICATION_DATABASE_URL in backend/.env.");
    error.statusCode = 503;
    error.status = 503;
    throw error;
  }
  return pool;
}

module.exports = { getGamificationPool };
