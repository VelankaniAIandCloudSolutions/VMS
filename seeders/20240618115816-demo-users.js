"use strict";

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require("sequelize");

const Role = require("../models/Roles");
const User = require("../models/Users");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();

    // Find role IDs for 'user', 'staff', and 'admin'
    const roles = await Role.findAll({
      where: {
        role_name: {
          [Sequelize.Op.in]: ["user", "staff", "admin"],
        },
      },
    });

    // Create users data with corresponding role_id
    const usersData = [
      {
        first_name: "Satvik",
        last_name: "",
        email: "satvik@example.com",
        role_id: roles.find((role) => role.role_name === "user").role_id,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        first_name: "Mayank",
        last_name: "",
        email: "mayank@example.com",
        role_id: roles.find((role) => role.role_name === "staff").role_id,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        first_name: "Sudheer",
        last_name: "",
        email: "sudheer@example.com",
        role_id: roles.find((role) => role.role_name === "admin").role_id,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    // Bulk insert users into the Users table
    await queryInterface.bulkInsert("Users", usersData);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all users
    await queryInterface.bulkDelete("Users", null, {});
  },
};
