import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const verifyUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
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
        "User verified successfully",
      ),
    );
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Server error occur", "SERVER_ERROR"));
  }
};
