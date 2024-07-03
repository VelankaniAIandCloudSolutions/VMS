// models/Locations.js

const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/sequelize"); // Adjust path based on your project structure

const Location = sequelize.define("Location", {
  location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  location_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
  },
});

module.exports = Location;
