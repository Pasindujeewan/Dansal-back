import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { hashToken } from "../utils/hashToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "User already exists", "USER_EXISTS"));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    //generate tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ userId: user._id });
    // Save refreshToken in DB
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

    // Return the user
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
        "User registered successfully",
        {
          accessToken,
          refreshToken,
        },
      ),
    );
  } catch (error) {
    return next(
      console.log(error),
      new ApiError(500, "Error registering user", "REGISTER_USER_ERROR"),
    );
  }
};
