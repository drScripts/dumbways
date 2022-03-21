require("dotenv").config();

module.exports = {
  dbUser: process.env.DATABASE_USER,
  dbPass: process.env.DATABASE_PASSWORD,
  dbHost: process.env.DATABASE_HOST,
  dbPort: process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  appSecure: process.env.APP_HTTPS === "true" || false,
};
