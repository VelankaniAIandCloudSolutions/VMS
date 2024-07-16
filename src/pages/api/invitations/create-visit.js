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

// import VisitType from "../../../../../models/VisitTypes";
// import { VisitType } from "../../../../../models/VisitTypes";
// import { User } from "../../../../../models/Users";
// import { Location } from "../../../../../models/Locations";
// import { Visit } from "../../../../../models/Visits";
// import { Role } from "../../../../../models/Roles";

// export default async function handler(req, res) {
//   try {
//     const session = await getServerSession(req, res, authOptions);

//     if (req.method === "GET") {
//       // Fetch visit types

//       const visitTypes = await VisitType.findAll();

//       // Fetch users (assuming findAll method exists in User model)
//       const users = await User.findAll();

//       // Fetch locations (assuming findAll method exists in Locations model)
//       const locations = await Location.findAll();

//       // Return both visit types, users, and locations in the response
//       res.status(200).json({ visitTypes, users, locations });
//     } else if (req.method === "POST") {
//       // Destructure data from the request body
//       console.log("session from server session", session);
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

//       // Find or create the visitor based on email
//       let visitor = await User.findOne({
//         where: { email },
//       });

//       if (!visitor) {
//         // Create the visitor if not found
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
//           // Optionally include any other fields relevant to the User model
//         });

//         // Assign the 'user' role to the new visitor
//         if (userRole) {
//           await visitor.update({ role_id: userRole.role_id });
//         } else {
//           console.error("Default role 'user' not found in the database.");
//           // Handle error case where default role does not exist
//           res.status(500).json({ error: "Failed to assign role to user" });
//           return;
//         }
//       }

//       console.log("visit date tiem comign form frotnend", visit_date_time);

//       const userStatus = session ? "Approved" : "Pending";
//       console.log("userStatus", userStatus);
//       // Create the visit entry
//       const newVisit = await Visit.create({
//         visit_date_time,
//         visitor_id: visitor.user_id,
//         host_id,
//         location_id,
//         phone,
//         purpose,
//         visit_type_id,
//         status: userStatus, // Assuming default status is "Pending"
//       });

//       // Optionally fetch the newly created visit to include all details
//       const fullVisit = await Visit.findByPk(newVisit.visit_id, {
//         include: [
//           { model: User, as: "Visitor" },
//           { model: User, as: "Host" },
//           { model: VisitType },
//           { model: Location },
//         ],
//       });
//       console.log("fullVisit in apiiii first  ", fullVisit);
//       // Convert the Sequelize model instances to plain JavaScript objects
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

//       console.log("h&m:", visitDetails);

//       res
//         .status(201)
//         .json({ message: "Visit created successfully", visit: fullVisit });

//       try {
//         sendEmail(visitDetails);
//         // Assuming sendEmail accepts visitDetails as argument
//         console.log("Confirmation email sent successfully");
//       } catch (error) {
//         console.error("Error sending confirmation email:", error);
//         // Handle error sending email (optional)
//       }
//     } else {
//       res.setHeader("Allow", ["GET", "POST"]);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Failed to process request" });
//   }
// }

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);
      try {
        const visitTypes = await VisitType.findAll();
        const users = await User.findAll();
        const locations = await Location.findAll();

        res.status(200).json({ visitTypes, users, locations });
      } catch (error) {
        console.error("Error fetching data:", error.response.data);
        res.status(500).json({ error: "Failed to fetch data" });
      }
    } else if (req.method === "POST") {
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
          const defaultPassword = "password";
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);

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
        } catch (error) {
          console.error(
            "Error sending confirmation email:",
            error.response.data
          );
          // Handle email sending error
        }
      } catch (error) {
        console.error(
          "Error creating or processing visit:",
          error.response.data
        );
        res.status(500).json({ error: "Failed to create visit" });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error.response.data);
    res.status(500).json({ error: "Failed to process request" });
  }
}
