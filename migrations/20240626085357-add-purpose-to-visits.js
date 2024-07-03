"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Visits", "purpose", {
      type: Sequelize.TEXT,
      allowNull: true, // Allowing null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Visits", "purpose");
  },
};
