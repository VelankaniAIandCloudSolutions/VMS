// const VisitType = require("../../../../models/VisitTypes");
// const User = require("../../../../models/Users");
// const Location = require("../../../../models/Locations");
// const Visit = require("../../../../models/Visits");
// const Role = require("../../../../models/Roles");
// const bcrypt = require("bcryptjs");
// const { sendEmail } = require("../../../utils/email");
// import moment from "moment-timezone";
// moment.tz.setDefault("Asia/Kolkata");
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]";

// export default async function handler(req, res) {
//   try {
//     if (req.method === "GET") {
//       try {
//         const visitTypes = await VisitType.findAll();
//         const users = await User.findAll();
//         const locations = await Location.findAll();

//         const jsonResponse = { visitTypes, users, locations };
//         console.log("Respone of create visit-backend:", jsonResponse);

//         res.status(200).json({ visitTypes, users, locations });
//       } catch (error) {
//         console.error("Error fetching data:", error.response.data);
//         res.status(500).json({ error: "Failed to fetch data" });
//       }
//     } else if (req.method === "POST") {
//       try {
//         const session = await getServerSession(req, res, authOptions);

//         const {
//           visit_date_time,
//           email,
//           firstName,
//           lastName,
//           host_id,
//           location_id,
//           phone,
//           purpose,
//           visit_type_id,
//         } = req.body;

//         let visitor = await User.findOne({ where: { email } });

//         if (!visitor) {
//           const userRole = await Role.findOne({ where: { role_name: "user" } });
//           const defaultPassword = "password";
//           const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//           visitor = await User.create({
//             email,
//             first_name: firstName,
//             last_name: lastName,
//             phone_number: phone,
//             password: hashedPassword,
//             role_id: userRole ? userRole.role_id : null,
//           });

//           if (!userRole) {
//             console.error("Default role 'user' not found in the database.");
//             res.status(500).json({ error: "Failed to assign role to user" });
//             return;
//           }
//         }

//         const userStatus = session ? "Approved" : "Pending";
//         const newVisit = await Visit.create({
//           visit_date_time,
//           visitor_id: visitor.user_id,
//           host_id,
//           location_id,
//           phone,
//           purpose,
//           visit_type_id,
//           status: userStatus,
//         });

//         const fullVisit = await Visit.findByPk(newVisit.visit_id, {
//           include: [
//             { model: User, as: "Visitor" },
//             { model: User, as: "Host" },
//             { model: VisitType },
//             { model: Location },
//           ],
//         });

//         if (!fullVisit) {
//           throw new Error("Failed to fetch full visit details");
//         }

//         const visitDetails = {
//           ...fullVisit.toJSON(),
//           visitor: fullVisit.Visitor.toJSON(),
//           host: fullVisit.Host.toJSON(),
//           visit_type: fullVisit.VisitType.toJSON(),
//           location: fullVisit.Location.toJSON(),
//           visitDateFormatted: moment(fullVisit.visit_date_time).format(
//             "DD-MM-YYYY"
//           ),
//           visitTimeFormatted: moment(fullVisit.visit_date_time).format(
//             "hh:mm:ss A"
//           ),
//         };

//         res
//           .status(201)
//           .json({ message: "Visit created successfully", visit: fullVisit });

//         try {
//           await sendEmail(visitDetails);
//           console.log("Confirmation email sent successfully");
//         } catch (error) {
//           console.error(
//             "Error sending confirmation email:",
//             error.response.data
//           );
//           // Handle email sending error
//         }
//       } catch (error) {
//         console.error(
//           "Error creating or processing visit:",
//           error.response.data
//         );
//         res.status(500).json({ error: "Failed to create visit" });
//       }
//     } else {
//       res.setHeader("Allow", ["GET", "POST"]);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   } catch (error) {
//     console.error("Error processing request:", error.response.data);
//     res.status(500).json({ error: "Failed to process request" });
//   }
// }

const VisitType = require("../../../../models/VisitTypes");
const User = require("../../../../models/Users");
const Location = require("../../../../models/Locations");
const Visit = require("../../../../models/Visits");
const Role = require("../../../../models/Roles");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../../utils/email");
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       console.log("Cookies in the request:", req.headers.cookie);
//       const session = await getServerSession(req, res, authOptions);
//       console.log("session in backend", session);

//       const {
//         visit_date_time,
//         email,
//         firstName,
//         lastName,
//         host_id,
//         location_id,
//         phone,
//         purpose,
//         visit_type_id,
//       } = req.body;

//       let visitor = await User.findOne({ where: { email } });

//       if (!visitor) {
//         const userRole = await Role.findOne({ where: { role_name: "user" } });
//         const defaultPassword = "password";
//         const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//         visitor = await User.create({
//           email,
//           first_name: firstName,
//           last_name: lastName,
//           phone_number: phone,
//           password: hashedPassword,
//           role_id: userRole ? userRole.role_id : null,
//         });

//         if (!userRole) {
//           console.error("Default role 'user' not found in the database.");
//           res.status(500).json({ error: "Failed to assign role to user" });
//           return;
//         }
//       }

//       const userStatus = session ? "Approved" : "Pending";
//       const newVisit = await Visit.create({
//         visit_date_time,
//         visitor_id: visitor.user_id,
//         host_id,
//         location_id,
//         phone,
//         purpose,
//         visit_type_id,
//         status: userStatus,
//       });

//       const fullVisit = await Visit.findByPk(newVisit.visit_id, {
//         include: [
//           { model: User, as: "Visitor" },
//           { model: User, as: "Host" },
//           { model: VisitType },
//           { model: Location },
//         ],
//       });

//       if (!fullVisit) {
//         throw new Error("Failed to fetch full visit details");
//       }

//       const visitDetails = {
//         ...fullVisit.toJSON(),
//         visitor: fullVisit.Visitor.toJSON(),
//         host: fullVisit.Host.toJSON(),
//         visit_type: fullVisit.VisitType.toJSON(),
//         location: fullVisit.Location.toJSON(),
//         visitDateFormatted: moment(fullVisit.visit_date_time).format(
//           "DD-MM-YYYY"
//         ),
//         visitTimeFormatted: moment(fullVisit.visit_date_time).format(
//           "hh:mm:ss A"
//         ),
//       };

//       res
//         .status(201)
//         .json({ message: "Visit created successfully", visit: fullVisit });

//       try {
//         await sendEmail(visitDetails);
//         console.log("Confirmation email sent successfully");
//       } catch (error) {
//         console.error("Error sending confirmation email:", error);
//         // Handle email sending error
//       }
//     } catch (error) {
//       console.error("Error creating or processing visit:", error);
//       res.status(500).json({ error: "Failed to create visit" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

export async function POST(req, res) {
  try {
    // Log cookies and session for debugging
    console.log("Cookies in the request:", req.headers.cookie);
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in backend:", session);

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

    // Check if the visitor exists
    let visitor = await User.findOne({ where: { email } });

    if (!visitor) {
      const userRole = await Role.findOne({ where: { role_name: "user" } });
      const defaultPassword = "password";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create a new visitor
      visitor = await User.create({
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        password: hashedPassword,
        role_id: userRole ? userRole.role_id : null,
      });

      if (!userRole) {
        console.error("Default role 'user' not found in the database.");
        res.status(500).json({ error: "Failed to assign role to user" });
        return;
      }
    }

    // Determine visit status based on session
    const userStatus = session ? "Approved" : "Pending";

    // Create a new visit
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

    // Fetch the complete visit details
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
      .json({ message: "Visit created successfully", visit: visitDetails });

    // Send confirmation email
    try {
      await sendEmail(visitDetails);
      console.log("Confirmation email sent successfully");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  } catch (error) {
    console.error("Error creating or processing visit:", error);
    res.status(500).json({ error: "Failed to create visit" });
  }
}

//
