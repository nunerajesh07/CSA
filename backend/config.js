



require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
  PORT: process.env.PORT || 3000,
};
