"use strict";

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require("sequelize");
const VisitType = require("../models/VisitTypes");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sample visit types data
    const visitTypesData = [
      { visit_type: "Meeting" },
      { visit_type: "Interview" },
      { visit_type: "Consultation" },
    ];
    console.log("hahah", VisitType);
    // Insert sample visit types into database
    await VisitType.bulkCreate(visitTypesData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all visit types
    await VisitType.destroy({ where: {} });
  },
};
