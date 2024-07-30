// lib/corsMiddleware.js
import Cors from "cors";

// Initialize the CORS middleware
const cors = Cors({
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: "*", // Adjust as needed for security
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  // Your existing handler logic here
}
