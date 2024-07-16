import axiosInstance from "@/utils/axiosConfig";

export default function handler(req, res) {
  // Filter out sensitive environment variables if needed
  const filteredEnvVars = { ...process.env };

  // Optionally, you can remove any sensitive variables you don't want to expose
  // delete filteredEnvVars.SECRET_KEY;

  res.status(200).json(filteredEnvVars);
}
