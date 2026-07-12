import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";

export const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return next(
        new ApiError(401, "Access token is required", "ACCESS_TOKEN_REQUIRED"),
      );
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    if (decoded.type !== "access") {
      return next(
        new ApiError(401, "Invalid token type", "INVALID_TOKEN_TYPE"),
      );
    }

    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Access token expired", "ACCESS_TOKEN_EXPIRED"),
      );
    }

    return next(
      new ApiError(401, "Invalid access token", "INVALID_ACCESS_TOKEN"),
    );
  }
};

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
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.decode(req.body.refreshToken);

      if (decoded?.userId) {
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
      }

      return next(
        new ApiError(401, "Refresh token expired", "REFRESH_TOKEN_EXPIRED"),
      );
    }

    return next(
      new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN"),
    );
  }
};
