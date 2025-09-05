// utils/jwt.js
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

export const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
