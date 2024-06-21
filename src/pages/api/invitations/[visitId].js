import { fetchInvitations } from "./all";
import Visit from "../../../../models/Visits";

export default async function handler(req, res) {
  console.log("inside cahgne-inv");
  const {
    query: { visitId },
    method,
    body,
  } = req;

  if (method === "PUT") {
    try {
      // Find the visit by visit_id
      const visit = await Visit.findByPk(visitId);

      if (!visit) {
        return res.status(404).json({ error: "Visit not found" });
      }

      // Update the visit's status
      visit.status = body.status;
      await visit.save();

      const { visits } = await fetchInvitations();

      return res.status(200).json({
        message: `Visit ${visitId} status updated to ${body.status}`,
        visits: visits, // Return updated invitations along with success message
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
