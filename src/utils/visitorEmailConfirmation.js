import moment from "moment-timezone";
import VisitType from "../../models/VisitTypes";
moment.tz.setDefault("Asia/Kolkata");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs-extra");
const path = require("path");
const helpers = require("handlebars-helpers")(); // Import Handlebars helpers

// Register additional helpers if needed
handlebars.registerHelper(helpers);

const sendEmail = async (visitDetails) => {
  if (!visitDetails) {
    throw new Error("Invalid visit details: visitor or host is undefined");
  }

  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "info@automhr.com",
      pass: "Hotel@123!",
    },
  });

  // Construct the template path relative to the project root
  const templatePath = path.join(
    process.cwd(),
    "src/utils/email-templates",
    "visitorStatusConfirmation.html"
  );

  const htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const compiledTemplate = handlebars.compile(htmlTemplate);
  console.log(visitDetails);

  const templateData = {
    confirmationId: visitDetails.confirmation_id,
    status: visitDetails.status,
    visitorFirstName: visitDetails.visitor.first_name,
    visitorLastName: visitDetails.visitor.last_name,
    visitorEmail: visitDetails.visitor.email,
    checkinTime: visitDetails.checkin_time
      ? moment(visitDetails.checkin_time).format("hh:mm A")
      : "00:00",
    checkoutTime: visitDetails.checkout_time
      ? moment(visitDetails.checkout_time).format("hh:mm A")
      : "00:00",
    locationName: visitDetails.location.location_name,
    purpose: visitDetails.purpose,
    hostFirstName: visitDetails.host.first_name,
    hostLastName: visitDetails.host.last_name,
    duration: visitDetails.checkout_time
      ? moment
          .duration(
            moment(visitDetails.checkout_time).diff(
              moment(visitDetails.checkin_time)
            )
          )
          .humanize()
      : "N/A",

    confirmationLink: `http://localhost:3000/visitorStatusConfirmation?visitId=${visitDetails.visit_id}`,
  };

  const htmlToSend = compiledTemplate(templateData);

  const mailOptions = {
    from: '"Velankani" <info@automhr.com>', // sender address
    // to: visitDetails.host.email,
    to: "ankitrajgaya2000@gmail.com",
    subject: "Visitor Status", // Subject line
    html: htmlToSend, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // Propagate the error
  }
};

module.exports = { sendEmail };
