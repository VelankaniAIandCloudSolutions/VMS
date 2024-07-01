import { fetchInvitations } from "../invitations/all";
import Visit from "../../../../models/Visits";

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
      const visit = await Visit.findByPk(visitId);

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
