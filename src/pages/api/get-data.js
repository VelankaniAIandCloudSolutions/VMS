const VisitType = require("../../../models/VisitTypes");
const User = require("../../../models/Users");
const Location = require("../../../models/Locations");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch data from the database
    const visitTypes = await VisitType.findAll();
    const users = await User.findAll();
    const locations = await Location.findAll();

    // Prepare the JSON response
    const jsonResponse = { visitTypes, users, locations };
    console.log("Response of get-data API:", jsonResponse);

    // Send the response
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
