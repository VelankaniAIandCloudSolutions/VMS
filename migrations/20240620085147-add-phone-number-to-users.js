"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the phone_number column from Users table
    await queryInterface.removeColumn("Users", "phone_number");
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the phone_number column to Users table
    await queryInterface.addColumn("Users", "phone_number", {
      type: Sequelize.STRING(15),
      allowNull: true,
    });
  },
};
