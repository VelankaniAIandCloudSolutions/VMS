// pages/api/users/index.js
const User = require("../../../../models/Users");
const Role = require("../../../../models/Roles");

export async function fetchUsers() {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: "role",
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export default async function handler(req, res) {
  try {
    const users = await fetchUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
