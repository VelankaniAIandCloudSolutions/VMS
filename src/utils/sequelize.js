const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

// Determine environment (default to 'development')
const env = process.env.NODE_ENV || "development";

// Load configuration from config.json based on environment
const config = require("../../config/config.json")[env];

// Use environment variables if available, otherwise fall back to config.json values
const sequelize = new Sequelize(
  process.env.DB_DATABASE || config.database,
  process.env.DB_USERNAME || config.username,
  process.env.DB_PASSWORD || config.password,
  {
    host: process.env.DB_HOST || config.host,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false, // Disable logging to avoid clutter
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection to  has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Call the function to test the connection
testConnection();

module.exports = sequelize;
