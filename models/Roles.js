// src/models/Roles.js

const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/sequelize"); // Adjust path based on your project structure

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
});

module.exports = Role;
