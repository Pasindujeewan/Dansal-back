import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(
        new ApiError(
          400,
          "Refresh token is required",
          "REFRESH_TOKEN_REQUIRED",
        ),
      );
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (decoded.type !== "refresh") {
      return next(
        new ApiError(401, "Token type is invalid", "INVALID_TOKEN_TYPE"),
      );
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.decode(req.body.refreshToken);
      const userId = decoded.userId;
      await User.findByIdAndUpdate(userId, { refreshToken: null });
      return next(
        new ApiError(401, "Refresh token expired", "REFRESH_TOKEN_EXPIRED"),
      );
    }
    console.log(error);
    return next(
      new ApiError(401, "Invalid refresh token2", "INVALID_REFRESH_TOKEN2"),
    );
  }
};
