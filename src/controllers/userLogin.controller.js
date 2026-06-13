import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { hashToken } from "../utils/hashToken.js";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ApiError(
          400,
          "Email and password are required",
          "MISSING_CREDENTIALS",
        ),
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(404, "User not found", "USER_NOT_FOUND"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS"),
      );
    }
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ userId: user._id });
    user.refreshToken = hashToken(refreshToken);
    await user.save();

    // Remove sensitive fields before returning the user
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.provider;
    delete userData.__v;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
        "User logged in successfully",
        {
          accessToken,
          refreshToken,
        },
      ),
    );
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Error logging in user", "LOGIN_USER_ERROR"));
  }
};
