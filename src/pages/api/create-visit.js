// pages/api/visit-types.js

const VisitType = require("../../../models/VisitTypes");
const User = require("../../../models/Users");
const Locations = require("../../../models/Locations");
const Visit = require("../../../models/Visits");
const Role = require("../../../models/Roles");

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Fetch visit types

      const visitTypes = await VisitType.findAll();

      // Fetch users (assuming findAll method exists in User model)
      const users = await User.findAll();

      // Fetch locations (assuming findAll method exists in Locations model)
      const locations = await Locations.findAll();

      // Return both visit types, users, and locations in the response
      res.status(200).json({ visitTypes, users, locations });
    } else if (req.method === "POST") {
      // Destructure data from the request body
      const {
        visit_date_time,
        email,
        firstName,
        lastName,
        host_id,
        location_id,
        phone,
        purpose,
        visit_type_id,
      } = req.body;

      // Find or create the visitor based on email
      let visitor = await User.findOne({
        where: { email },
      });

      if (!visitor) {
        // Create the visitor if not found
        const userRole = await Role.findOne({ where: { role_name: "user" } });

        visitor = await User.create({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          role_id: userRole ? userRole.role_id : null,
          // Optionally include any other fields relevant to the User model
        });

        // Assign the 'user' role to the new visitor
        if (userRole) {
          await visitor.update({ role_id: userRole.role_id });
        } else {
          console.error("Default role 'user' not found in the database.");
          // Handle error case where default role does not exist
          res.status(500).json({ error: "Failed to assign role to user" });
          return;
        }
      }

      // Create the visit entry
      const newVisit = await Visit.create({
        visit_date_time,
        visitor_id: visitor.user_id,
        host_id,
        location_id,
        phone,
        purpose,
        visit_type_id,
        status: "Pending", // Assuming default status is "Pending"
      });

      // Optionally fetch the newly created visit to include all details
      const fullVisit = await Visit.findByPk(newVisit.visit_id, {
        include: [
          { model: User, as: "Visitor" },
          { model: User, as: "Host" },
          { model: VisitType },
          { model: Locations },
        ],
      });

      res
        .status(201)
        .json({ message: "Visit created successfully", visit: fullVisit });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
