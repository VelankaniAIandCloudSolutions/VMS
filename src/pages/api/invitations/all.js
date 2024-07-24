import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");
const VisitType = require("../../../../models/VisitTypes");
const User = require("../../../../models/Users");
const Location = require("../../../../models/Locations");
const Visit = require("../../../../models/Visits");
const Role = require("../../../../models/Roles");

export async function fetchInvitations() {
  try {
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

    const visitsFormatted = visits.map((visit) => {
      if (!visit.visit_date_time) {
        return {
          ...visit.toJSON(),
          visit_date: "", // Handle null or undefined visit_date_time
          visit_time: "",
        };
      }

      const visitDateTime = moment(visit.visit_date_time);
      const visitDateFormatted = visitDateTime.format("DD-MM-YYYY");
      const visitTimeFormatted = visitDateTime.format("hh:mm:ss A");

      return {
        ...visit.toJSON(),
        visit_date: visitDateFormatted,
        visit_time: visitTimeFormatted,
      };
    });

    return { visits: visitsFormatted };
  } catch (error) {
    console.error("Error fetching visits:", error);
    throw new Error("Failed to fetch visits");
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Allow specific methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow specific headers

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      console.log("api being called");
      const { visits } = await fetchInvitations();

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
