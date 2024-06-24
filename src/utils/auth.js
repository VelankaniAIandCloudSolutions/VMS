// auth.js
require("dotenv").config();
import { sign, verify } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;
// const generateToken = async (userId, role) => {
//   return sign({ userId, role }, "secret", {
//     expiresIn: "7d", // adjust as per your requirements
//   });
// };
const generateToken = async (userDetails) => {
  console.log("jwt secret key beign red from .env file", JWT_SECRET);

  return sign({ userDetails }, process.env.JWT_SECRET, {
    expiresIn: "7d", // adjust as per your requirements
  });
};

const verifyToken = async (token) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const hashPassword = async (password) => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

const comparePasswords = async (inputPassword, hashedPassword) => {
  return compare(inputPassword, hashedPassword);
};

export default {
  generateToken,
  verifyToken,
  hashPassword,
  comparePasswords,
};
