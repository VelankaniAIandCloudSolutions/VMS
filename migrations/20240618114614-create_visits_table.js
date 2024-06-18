"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Visits", {
      visit_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      visitor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Assuming Users is the name of your Users table
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      host_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Assuming Users is the name of your Users table
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      checkin_time: {
        type: Sequelize.DATE,
      },
      checkout_time: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Declined"),
        allowNull: false,
        defaultValue: "Pending",
      },
      visit_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "VisitTypes", // Assuming VisitTypes is the name of your VisitTypes table
          key: "visit_type_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Locations", // Assuming Locations is the name of your Locations table
          key: "location_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Visits");
  },
};
