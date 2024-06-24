"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add password column to users table
    await queryInterface.addColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false, // Adjust as per your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove password column from users table
    await queryInterface.removeColumn("Users", "password");
  },
};
