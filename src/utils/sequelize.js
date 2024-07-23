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

// const { Sequelize } = require("sequelize");
// require("dotenv").config(); // Load environment variables from .env file

// // Determine environment (default to 'development')
// const env = process.env.NODE_ENV || "development";

// // Load configuration from config.json based on environment
// const config = require("../../config/config.json")[env];
// // const config = require("../../config/config.json");

// // Use environment variables if available, otherwise fall back to config.json values
// const sequelize = new Sequelize(
//   process.env.DB_DATABASE || config.database,
//   process.env.DB_USERNAME || config.username,
//   process.env.DB_PASSWORD || config.password,
//   {
//     host: process.env.DB_HOST || config.host,
//     dialect: "mysql",
//     dialectModule: require("mysql2"),
//     logging: false, // Disable logging to avoid clutter
//   }
// );

// // Test the connection
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connection to  has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// }

// testConnection();

// module.exports = sequelize;

const { Sequelize } = require("sequelize");

// Hardcoded database credentials
const sequelize = new Sequelize(
  "visitor_management", // database name
  "admin", // username
  "Password@123", // password
  {
    host: "13.233.163.245", // database host
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false, // Disable logging to avoid clutter
  }
);
//

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;
//
