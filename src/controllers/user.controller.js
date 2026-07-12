import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { getUserDansals } from "./dansal.controller.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select(
      "-password -refreshToken -__v -createdAt -updatedAt",
    );

    if (!user) {
      return next(new ApiError(404, "User not found", "USER_NOT_FOUND"));
    }

    const dansals = await getUserDansals(userId);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userData: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
          dansals,
        },
        "User profile retrieved successfully",
      ),
    );
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Internal server error", "PROFILE_ERROR"));
  }
};

export const sendNearbyDansalNotification = async (req, res, next) => {
  try {
    const { expoPushToken } = req.body;

    if (!expoPushToken) {
      return next(
        new ApiError(400, "Expo push token is required", "PUSH_TOKEN_REQUIRED"),
      );
    }

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: expoPushToken,
        title: "Nearby Dansal",
        body: "Dansal is only 400m away",
      }),
    });

    const data = await response.json();

    return res.json(data);
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(
        500,
        "Failed to send nearby dansal notification",
        "NOTIFICATION_ERROR",
      ),
    );
  }
};
