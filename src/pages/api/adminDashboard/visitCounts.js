const Visit = require("../../../../models/Visits");
const Sequelize = require("sequelize");

// Function to fetch visit counts
async function fetchVisitCounts() {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0); // Set to beginning of today
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999); // Set to end of today

    // Count pending visits for today
    const pendingCount = await Visit.count({
      where: {
        status: "Pending",
        visit_date_time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    // Count approved visits for today
    const approvedCount = await Visit.count({
      where: {
        status: "Approved",
        visit_date_time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    // Count rejected visits for today
    const rejectedCount = await Visit.count({
      where: {
        status: "Declined",
        visit_date_time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    // Count completed meetings (where both check-in and check-out times are present)
    const completedMeetingsCount = await Visit.count({
      where: {
        checkin_time: { [Sequelize.Op.not]: null },
        checkout_time: { [Sequelize.Op.not]: null },
        visit_date_time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });
    return {
      visitCounts: {
        pending_visit_count: pendingCount,
        approved_visit_count: approvedCount,
        rejected_visit_count: rejectedCount,
        completedMeetings: completedMeetingsCount,
      },
    };
  } catch (error) {
    console.error("Error fetching visit counts:", error);
    throw new Error("Internal server error");
  }
}

// Example usage in a Next.js API route
export default async function handler(req, res) {
  try {
    const counts = await fetchVisitCounts();
    res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching visit counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
