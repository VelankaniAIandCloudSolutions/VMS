import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");
import Visit from "../../../../models/Visits";
import User from "../../../../models/Users"; // Assuming User model for Visitor
import VisitType from "../../../../models/VisitTypes";
import Location from "../../../../models/Locations";
import { fetchInvitations } from "./all"; // Assuming you have a function to fetch invitations
const { sendEmail } = require("../../../utils/email");
import { getServerSession } from "next-auth/next";
// import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { NextAuth } from "../auth/[...nextauth]";
// import nextAuth from "next-auth";
import { NextRequest, NextResponse } from "next";

export default async function handler(req, res) {
  const {
    query: { visitId },
    method,
    body,
  } = req;

  let session;

  try {
    if (method === "GET") {
      try {
        // Find the visit by visit_id, including related models
        console.log("visitId", visitId);
        const visit = await Visit.findByPk(visitId, {
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

        if (!visit) {
          return res.status(404).json({ error: "Visit not found" });
        }

        let visitDateFormatted = "";
        let visitTimeFormatted = "";
        if (visit.visit_date_time) {
          const visitDateTime = moment(visit.visit_date_time);
          visitDateFormatted = visitDateTime.format("DD-MM-YYYY");
          visitTimeFormatted = visitDateTime.format("hh:mm:ss A");
        }

        // Serialize the visit details
        const serializedVisit = {
          visit_id: visit.visit_id,
          purpose: visit.purpose,
          visitor: {
            user_id: visit.Visitor.user_id,
            email: visit.Visitor.email,
            first_name: visit.Visitor.first_name,
            last_name: visit.Visitor.last_name,
            phone_number: visit.Visitor.phone_number,
          },
          host: {
            user_id: visit.Host.user_id,
            email: visit.Host.email,
            first_name: visit.Host.first_name,
            last_name: visit.Host.last_name,
            phone_number: visit.Host.phone_number,
          },
          visit_date: visitDateFormatted, // Add formatted visit_date
          visit_time: visitTimeFormatted, // Add formatted visit_time
          checkin_time: visit.checkin_time,
          checkout_time: visit.checkout_time,
          status: visit.status,
          visit_type: {
            visit_type_id: visit.VisitType.visit_type_id,
            visit_type: visit.VisitType.visit_type,
          },
          location: {
            location_id: visit.Location.location_id,
            location_name: visit.Location.location_name,
            address: visit.Location.address,
          },
          confirmation_id: visit.confirmation_id,
          createdAt: visit.createdAt,
          updatedAt: visit.updatedAt,
        };

        return res.status(200).json(serializedVisit);
      } catch (error) {
        console.error("Error fetching visit details:", error);
        return res.status(500).json({ error: "Failed to fetch visit details" });
      }
    } else if (method === "PUT") {
      try {
        // Find the visit by visit_id
        const visit = await Visit.findByPk(visitId);

        if (!visit) {
          return res.status(404).json({ error: "Visit not found" });
        }

        // Check permissions or roles here if needed
        // const userRole = session.user.role;
        // const userId = session.user.id;
        // if (userRole !== "admin" && visit.host_id !== userId) {
        //   return res.status(403).json({
        //     error: "Forbidden: You can only modify visits addressed to you.",
        //   });
        // }

        if (
          (visit.status === "Approved" && body.status === "Approved") ||
          (visit.status === "Declined" && body.status === "Declined")
        ) {
          return res.status(400).json({
            error: `Status is already ${visit.status}`,
          });
        }

        visit.status = body.status;
        await visit.save();

        const { visits } = await fetchInvitations();

        // Optionally fetch the newly updated visit to include all details
        const fullVisit = await Visit.findByPk(visitId, {
          include: [
            { model: User, as: "Visitor" },
            { model: User, as: "Host" },
            { model: VisitType },
            { model: Location },
          ],
        });

        // Convert the Sequelize model instances to plain JavaScript objects
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

        // Uncomment below to send email notification
        // try {
        //   await sendEmail(visitDetails);
        //   console.log("Confirmation email sent successfully");
        // } catch (error) {
        //   console.error("Error sending confirmation email:", error);
        // }

        return res.status(200).json({
          message: `Visit ${visitId} status updated to ${body.status}`,
          visits: visits, // Return updated invitations along with success message
        });
      } catch (error) {
        console.error("Error updating visit status:", error);
        return res.status(500).json({ error: "Failed to update visit status" });
      }
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
