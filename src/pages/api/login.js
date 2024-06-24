// pages/api/login.js

import auth from "../../utils/auth";

const User = require("../../../models/Users");
const Role = require("../../../models/Roles");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }],
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await auth.comparePasswords(password, user.password);

    console.log("password match value=", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("user details", userDetails);

    // const token = auth.generateToken(user.id, user.role); // Generate JWT
    // const token = auth.generateToken(userDetails);

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "development",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //   sameSite: "strict",
    //   path: "/",
    // });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
