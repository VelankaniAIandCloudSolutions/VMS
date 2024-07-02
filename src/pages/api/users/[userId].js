import User from "../../../../models/Users";
import Role from "../../../../models/Roles";
import { fetchUsers } from "../../api/users/all"; // Importing fetchUsers function

export default async function handler(req, res) {
  const {
    query: { user_id },
    method,
    body,
  } = req;

  try {
    if (method === "GET") {
      // Fetch user by user_id
      const user = await User.findByPk(user_id, {
        include: [
          {
            model: Role,
            attributes: ["role_id", "role_name"],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } else if (method === "PUT") {
      // Update user by user_id
      const { email, firstName, lastName, phone, role_id } = body;

      let user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.email = email || user.email;
      user.first_name = firstName || user.first_name;
      user.last_name = lastName || user.last_name;
      user.phone_number = phone || user.phone_number;
      user.role_id = role_id || user.role_id;

      await user.save();

      // Fetch the updated list of users
      const users = await fetchUsers();

      return res.status(200).json({
        message: "User updated successfully",
        users,
      });
    } else if (method === "DELETE") {
      // Delete user by user_id
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();

      // Fetch the updated list of users
      const users = await fetchUsers();

      return res.status(200).json({
        message: "User deleted successfully",
        users,
      });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
