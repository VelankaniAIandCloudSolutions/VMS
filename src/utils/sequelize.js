// const { Sequelize } = require("sequelize");
// const config = require("../../config/config.json");

// // Initialize Sequelize with your configuration
// const sequelize = new Sequelize(
//   config.development.database,
//   config.development.username,
//   config.development.password,
//   {
//     host: config.development.host,
//     dialect: "mysql",
//     logging: false, // Disable logging to avoid clutter
//   }
// );

// module.exports = sequelize;

// changed the settings based on env varaible
const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

// Determine environment (default to 'development')
const env = process.env.NODE_ENV || "development";

// Load configuration from config.json based on environment
const config = require("../../config/config.json")[env];

// Initialize Sequelize with configuration
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
    logging: false, // Disable logging to avoid clutter
  }
);

module.exports = sequelize;
