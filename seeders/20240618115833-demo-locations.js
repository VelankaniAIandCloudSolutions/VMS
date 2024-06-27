"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const locationsData = [
      {
        location_name: "Office A",
        address: "123 Main St, City A, State A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        location_name: "Office B",
        address: "456 Elm St, City B, State B",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Locations", locationsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Locations", null, {});
  },
};
