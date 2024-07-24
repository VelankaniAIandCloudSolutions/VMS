import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");
const VisitType = require("../../../../models/VisitTypes");
const User = require("../../../../models/Users");
const Location = require("../../../../models/Locations");
const Visit = require("../../../../models/Visits");
const Role = require("../../../../models/Roles");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../../utils/email");
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const session = await getServerSession(req, res, authOptions);
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

        let visitor = await User.findOne({ where: { email } });

        if (!visitor) {
          const userRole = await Role.findOne({ where: { role_name: "user" } });
          if (!userRole) {
            console.error("Default role 'user' not found in the database.");
            return res
              .status(500)
              .json({ error: "Failed to assign role to user" });
          }

          const defaultPassword = "password";
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);

          visitor = await User.create({
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            password: hashedPassword,
            role_id: userRole.role_id,
          });
        }

        const userStatus = session ? "Approved" : "Pending";
        const newVisit = await Visit.create({
          visit_date_time,
          visitor_id: visitor.user_id,
          host_id,
          location_id,
          phone,
          purpose,
          visit_type_id,
          status: userStatus,
        });

        const fullVisit = await Visit.findByPk(newVisit.visit_id, {
          include: [
            { model: User, as: "Visitor" },
            { model: User, as: "Host" },
            { model: VisitType },
            { model: Location },
          ],
        });

        if (!fullVisit) {
          throw new Error("Failed to fetch full visit details");
        }

        const visitDetails = {
          ...fullVisit.toJSON(),
          visitor: fullVisit.Visitor.toJSON(),
          host: fullVisit.Host.toJSON(),
          visit_type: fullVisit.VisitType.toJSON(),
          location: fullVisit.Location.toJSON(),
          visitDateFormatted: moment(fullVisit.visit_date_time).format(
            "DD-MM-YYYY"
          ),
          visitTimeFormatted: moment(fullVisit.visit_date_time).format(
            "hh:mm:ss A"
          ),
        };

        res
          .status(201)
          .json({ message: "Visit created successfully", visit: fullVisit });

        try {
          await sendEmail(visitDetails);
          console.log("Confirmation email sent successfully");
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Handle email sending error
        }
      } catch (error) {
        console.error("Error creating or processing visit:", error);
        res
          .status(500)
          .json({ error: error.message || "Failed to create visit" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Unexpected error processing request:", error);
    res.status(500).json({ error: error.message || "Unexpected server error" });
  }
}
