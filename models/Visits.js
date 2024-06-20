// models/Visits.js

const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/sequelize"); // Adjust path based on your project structure
const User = require("./Users"); // Import the User model
const VisitType = require("./VisitTypes"); // Import the VisitType model
const Location = require("./Locations"); // Import the Location model

const Visit = sequelize.define("Visit", {
  visit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  visitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  host_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  visit_date_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkin_time: {
    type: DataTypes.DATE,
  },
  checkout_time: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Declined"),
    allowNull: false,
    defaultValue: "Pending",
  },
  visit_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: VisitType,
      key: "visit_type_id",
    },
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Location,
      key: "location_id",
    },
  },
});

// Establish associations
Visit.belongsTo(User, {
  as: "Visitor",
  foreignKey: "visitor_id",
});

Visit.belongsTo(User, {
  as: "Host",
  foreignKey: "host_id",
});

Visit.belongsTo(VisitType, {
  foreignKey: "visit_type_id",
});

Visit.belongsTo(Location, {
  foreignKey: "location_id",
});
module.exports = Visit;
