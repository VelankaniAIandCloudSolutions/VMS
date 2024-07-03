// models/VisitTypes.js

const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/sequelize"); // Adjust path based on your project structure

const VisitType = sequelize.define("VisitType", {
  visit_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  visit_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // Ensure visit_type is unique
  },
});

module.exports = VisitType;
