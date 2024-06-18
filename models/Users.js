// models/Users.js

const { DataTypes } = require("sequelize");
const sequelize = require("..utils/sequelize"); // Path to your Sequelize configuration
const Role = require("./Roles"); // Import the Role model

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Role,
      key: "role_id",
    },
  },
});

module.exports = User;
