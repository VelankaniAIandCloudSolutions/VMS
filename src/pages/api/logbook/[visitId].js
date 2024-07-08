import { fetchInvitations } from "../invitations/all";
import Visit from "../../../../models/Visits";
import User from "../../../../models/Users";
import VisitType from "../../../../models/VisitTypes";
import Location from "../../../../models/Locations";
const { sendEmail } = require("../../../utils/visitorEmailConfirmation");

import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");

export default async function handler(req, res) {
  console.log("inside cahgne-inv");
  const {
    query: { visitId },
    method,
    body,
    s,
  } = req;

  if (method === "PUT") {
    try {
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

      if (body.checkin_time) {
        visit.checkin_time = body.checkin_time;
      }

      if (visit.checkin_time !== null && body.checkout_time) {
        visit.checkout_time = body.checkout_time;
      }
      await visit.save();

      const { visits } = await fetchInvitations();

      console.log("Email for visit ", visit);
      let visitDateFormatted = "";
      let visitTimeFormatted = "";
      if (visit.visit_date_time) {
        const visitDateTime = moment(visit.visit_date_time);
        visitDateFormatted = visitDateTime.format("DD-MM-YYYY");
        visitTimeFormatted = visitDateTime.format("hh:mm:ss A");
      }

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
        visit_date: visitDateFormatted,
        visit_time: visitTimeFormatted,
        checkin_time: visit.checkin_time,
        checkout_time: visit.checkout_time || "--:--",
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

      try {
        await sendEmail(serializedVisit);
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Failed to send email:", error);
      }

      return res.status(200).json({
        message: `Visit ${visitId} Time updated to ${body.checkin_time}`,
        visits: visits,
      });
    } catch (error) {
      console.error("Error updating visit status:", error);
      return res.status(500).json({ error: "Failed to update visit status" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
