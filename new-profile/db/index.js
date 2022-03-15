const { Pool } = require("pg");
const { dbHost, dbName, dbPass, dbPort, dbUser } = require("../config");

const pool = new Pool({
  user: dbUser,
  password: dbPass,
  host: dbHost,
  database: dbName,
  port: dbPort,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
