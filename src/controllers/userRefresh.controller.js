import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import userModel from "../models/user.model.js";
import { hashToken } from "../utils/hashToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export const userRefreshController = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userID:", userId);
    const refreshToken = req.body.refreshToken;
    console.log("Refresh token request received", refreshToken);
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(new ApiError(404, "User not found", "USER_NOT_FOUND"));
    }
    // Check if the refresh token matches the one in the database
    console.log("Hashed Refresh Token in DB:", user.refreshToken);
    console.log("hashed", hashToken(refreshToken));
    if (hashToken(refreshToken) !== user.refreshToken) {
      return res
        .status(401)
        .json(
          new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN"),
        );
    }
    // generate new Tokens
    const newAccessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });
    const newRefreshToken = generateRefreshToken({ userId: user._id });
    // Save new refershToken
    user.refreshToken = hashToken(newRefreshToken);
    console.log("New refresh token generated and saved", newRefreshToken);
    await user.save();
    return res.status(200).json(
      new ApiResponse(200, null, "Tokens refreshed successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Error refreshing tokens", "REFRESH_TOKENS_ERROR"),
      );
  }
};
