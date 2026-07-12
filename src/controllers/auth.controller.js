import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import { hashToken } from "../utils/token-hash.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const createAuthTokens = (user) => ({
  accessToken: generateAccessToken({
    userId: user._id,
    email: user.email,
  }),
  refreshToken: generateRefreshToken({ userId: user._id }),
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, notifyToken } = req.body;

    if (!name || !email || !password) {
      return next(
        new ApiError(
          400,
          "Name, email, and password are required",
          "MISSING_REGISTER_FIELDS",
        ),
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "User already exists", "USER_EXISTS"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      notifyToken,
    });

    const { accessToken, refreshToken } = createAuthTokens(user);

    // Store only a hash of the refresh token so leaked database data cannot be used directly.
    user.refreshToken = hashToken(refreshToken);
    await user.save();

    return res.status(201).json(
      new ApiResponse(
        201,
        { user: sanitizeUser(user) },
        "User registered successfully",
        { accessToken, refreshToken },
      ),
    );
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Error registering user", "REGISTER_USER_ERROR"),
    );
  }
};

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

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return next(
        new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS"),
      );
    }

    const { accessToken, refreshToken } = createAuthTokens(user);
    user.refreshToken = hashToken(refreshToken);
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        { user: sanitizeUser(user) },
        "User logged in successfully",
        { accessToken, refreshToken },
      ),
    );
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Error logging in user", "LOGIN_USER_ERROR"));
  }
};

export const refreshAuthTokens = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { refreshToken } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found", "USER_NOT_FOUND"));
    }

    if (hashToken(refreshToken) !== user.refreshToken) {
      return next(
        new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN"),
      );
    }

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = createAuthTokens(user);

    user.refreshToken = hashToken(newRefreshToken);
    await user.save();

    return res.status(200).json(
      new ApiResponse(200, null, "Tokens refreshed successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
    );
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Error refreshing tokens", "REFRESH_TOKENS_ERROR"),
    );
  }
};

export const verifyCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found", "USER_NOT_FOUND"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { user: sanitizeUser(user) },
        "User verified successfully",
      ),
    );
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Server error occurred", "SERVER_ERROR"));
  }
};
