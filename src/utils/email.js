// utils/email.js
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs-extra");
const path = require("path");
const helpers = require("handlebars-helpers")(); // Import Handlebars helpers
import dotenv from "dotenv";
dotenv.config(); //

// Register additional helpers if needed
handlebars.registerHelper(helpers);
const sendEmail = async (visitDetails) => {
  // Create a Nodemailer transporter using SMTP
  console.log("visit detaisl bein recieved i nmail fucntion", visitDetails);

  if (!visitDetails) {
    throw new Error("Invalid visit details: visitor or host is undefined");
  }

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
    "scheduleConfirmation.html"
  );
  // const templatePath = "../utils/email-templates/scheduleConfirmation.html";

  console.log("__dirname:", __dirname);
  console.log("templatePath:", templatePath);

  const htmlTemplate = fs.readFileSync(templatePath, "utf8");

  // Compile the template using Handlebars
  const compiledTemplate = handlebars.compile(htmlTemplate);

  // Define data to be passed into the template
  const templateData = {
    confirmationId: visitDetails.confirmation_id,
    status: visitDetails.status,
    visitorFirstName: visitDetails.visitor.first_name,
    visitorLastName: visitDetails.visitor.last_name,
    visitorEmail: visitDetails.visitor.email,
    visitDate: visitDetails.visitDateFormatted,
    visitTime: visitDetails.visitTimeFormatted,
    locationName: visitDetails.location.location_name,
    visitType: visitDetails.visit_type.visit_type,
    purpose: visitDetails.purpose,
    hostFirstName: visitDetails.host.first_name,
    hostLastName: visitDetails.host.last_name,
    // confirmationLink: `http://localhost:3000/scheduleVisitConfirmation?visitId=${visitDetails.visit_id}`,
    confirmationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/scheduleVisitConfirmation?visitId=${visitDetails.visit_id}`,
  };

  const htmlToSend = compiledTemplate(templateData);

  const mailOptions = {
    from: '"Velankani" <info@automhr.com>',
    to: visitDetails.visitor.email,
    subject: "Visit Request Confirmation",
    html: htmlToSend,
  };

  // Send email
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
