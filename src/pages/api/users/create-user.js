const User = require("../../../../models/Users");
const Role = require("../../../../models/Roles");
import { fetchUsers } from "../../api/users/all";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Fetch roles
      const roles = await Role.findAll();

      res.status(200).json({ roles });
    } else if (req.method === "POST") {
      const { email, first_name, last_name, phone_number, role_id, password } =
        req.body;

      // Find the user based on email
      let user = await User.findOne({
        where: { email },
      });

      if (user) {
        // If user already exists, return an error
        return res
          .status(400)
          .json({ error: "User with the same email already exists" });
      }

      // Create the user if not found
      user = await User.create({
        email,
        first_name,
        last_name,
        phone_number,
        password, // Use the password as it comes from the frontend
        role_id,
        // Optionally include any other fields relevant to the User model
      });

      // Assign the role to the new user
      const assignedRole = await Role.findByPk(role_id);
      if (assignedRole) {
        await user.update({ role_id });
      } else {
        console.error(`Role with ID ${role_id} not found in the database.`);
        // Handle error case where role does not exist
        res.status(500).json({ error: "Failed to assign role to user" });
        return;
      }
      const users = await fetchUsers();
      res.status(201).json({ message: "User created successfully", users });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
