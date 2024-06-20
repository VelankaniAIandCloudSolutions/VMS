// pages/api/visit-types.js

const VisitType = require("../../../models/VisitTypes");
const User = require("../../../models/Users");
const Locations = require("../../../models/Locations");

// Adjust the import based on your project structure

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Fetch visit types
      const visitTypes = await VisitType.findAll();

      // Fetch users (assuming findAll method exists in User model)
      const users = await User.findAll();

      const locations = await Locations.findAll();

      // Return both visit types and users in the response
      res.status(200).json({ visitTypes, users, locations });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
