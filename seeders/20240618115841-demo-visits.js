"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const visitsData = [
      {
        visit_id: 1,
        visitor_id: 1,
        host_id: 1,
        checkin_time: new Date(),
        checkout_time: new Date(),
        status: "completed",
        visit_type_id: 1,
        location_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        visit_id: 2,
        visitor_id: 2,
        host_id: 1,
        checkin_time: new Date(),
        checkout_time: new Date(),
        status: "completed",
        visit_type_id: 3,
        location_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("visits", visitsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("visits", null, {});
  },
};
