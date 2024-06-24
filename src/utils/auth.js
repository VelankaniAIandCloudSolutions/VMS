// auth.js

import { sign, verify } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcryptjs";

const generateToken = (userId, role) => {
  return sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // adjust as per your requirements
  });
};

const verifyToken = (token) => {
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
