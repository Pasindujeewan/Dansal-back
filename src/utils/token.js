import jwt from "jsonwebtoken";

export const generateAccessToken = ({ userId, email }) => {
  return jwt.sign(
    { userId, email, type: "access" },
    process.env.ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRE,
    },
  );
};

export const generateRefreshToken = ({ userId }) => {
  return jwt.sign({ userId, type: "refresh" }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRE,
  });
};
