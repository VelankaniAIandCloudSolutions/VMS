// models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/sequelize"); // Assuming this is your Sequelize configuration
const bcrypt = require("bcryptjs");

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
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Role,
      key: "role_id",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash the password before saving to the database
User.beforeCreate(async (user) => {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

// Method to verify password against hashed password
User.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
