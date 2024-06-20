const VisitType = require("../../../models/VisitTypes");
const User = require("../../../models/Users");
const Location = require("../../../models/Locations");
const Visit = require("../../../models/Visits");
const Role = require("../../../models/Roles");

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const visits = await Visit.findAll({
        include: [
          {
            model: User,
            as: "Visitor",
            attributes: [
              "user_id",
              "email",
              "first_name",
              "last_name",
              "phone_number",
            ],
          },
          {
            model: User,
            as: "Host",
            attributes: [
              "user_id",
              "email",
              "first_name",
              "last_name",
              "phone_number",
            ],
          },
          {
            model: VisitType,
            attributes: ["visit_type_id", "visit_type"],
          },
          {
            model: Location,
            attributes: ["location_id", "location_name", "address"],
          },
        ],
      });

      res.status(200).json({ visits });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
}
