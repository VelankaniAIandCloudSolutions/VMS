"use strict";
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
const User = require("../models/Users");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define passwords for specific users
    const passwords = {
      1: "satvik", // Plain passwords for specific users
      2: "mayank",
      3: "sudeer",
      4: "pranav",
    };

    // Hash passwords and update users
    for (let userId in passwords) {
      const password = passwords[userId];
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.update(
        { password: hashedPassword },
        { where: { user_id: userId } }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // This is a placeholder for rollback logic if needed
    // Down migrations should typically revert changes made in up migrations
    console.log("Rollback logic here if needed");
  },
};
