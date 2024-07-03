// models/Visits.js

const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/sequelize"); // Adjust path based on your project structure
const User = require("./Users"); // Import the User model
const VisitType = require("./VisitTypes"); // Import the VisitType model
const Location = require("./Locations"); // Import the Location model

// Function to generate a unique 6-digit ID
function generateConfirmationId() {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
}

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
  confirmation_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.TEXT, // Updated to TEXT to allow long strings
    allowNull: true, // Allowing null values
  },
});
// Hook to generate unique confirmation ID before creating a new visit
Visit.beforeValidate(async (visit) => {
  console.log("Before create hook triggered for Visit:", visit.toJSON());

  let uniqueIdFound = false;
  while (!uniqueIdFound) {
    const confirmationId = generateConfirmationId();
    console.log("Generated confirmation ID:", confirmationId);

    const existingVisit = await Visit.findOne({
      where: { confirmation_id: confirmationId },
    });

    if (!existingVisit) {
      visit.confirmation_id = confirmationId;
      uniqueIdFound = true;
      console.log("Unique confirmation ID found and assigned:", confirmationId);
    } else {
      console.log("Confirmation ID already exists, generating a new one...");
    }
  }
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
