// config.js
// Loads environment variables and exports configuration constants.
// All sensitive values (secrets, DB URI) come from .env — never hardcode them.

require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
  PORT: process.env.PORT || 3000,
};
