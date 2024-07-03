"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "phone_number");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "phone_number", {
      type: Sequelize.STRING(15),
      allowNull: true,
    });
  },
};
