import jwt from "jsonwebtoken";

export const generateToken = ({ userId, email }) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
