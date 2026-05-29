import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const accessToken = authHeader?.split(" ")[1];
    console.log("Access Token:", accessToken);
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
    next();
  } catch (error) {
    console.log(error);
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
