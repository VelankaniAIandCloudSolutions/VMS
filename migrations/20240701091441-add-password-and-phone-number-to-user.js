"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'password' and 'phone_number' columns to 'Users' table
    await queryInterface.addColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "phone_number", {
      type: Sequelize.STRING(15),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'password' and 'phone_number' columns from 'Users' table
    await queryInterface.removeColumn("Users", "password");
    await queryInterface.removeColumn("Users", "phone_number");
  },
};
