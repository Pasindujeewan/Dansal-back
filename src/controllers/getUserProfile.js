import User from "../models/user.model.js";
import Dansal from "../models/dansal.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const fullUser = await User.findById(user.userId).select(
      "-password -refreshToken -__v -createdAt -updatedAt",
    );
    if (!fullUser) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    const dansals = await Dansal.find({ createdBy: user.userId }).select(
      "name description imageUrl type location queueLength createdBy",
    );
    // Format the dansals to include only necessary fields
    const formattedDansals = dansals.map((dansal) => ({
      id: dansal._id,
      type: dansal.type,
      description: dansal.description,
      imageUrl: dansal.imageUrl,
      location: dansal.location.coordinates, // [longitude, latitude]
      queueLength: dansal.queueLength,
      createdBy: dansal.createdBy.toString(),
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userData: {
            id: fullUser._id.toString(),
            name: fullUser.name,
            email: fullUser.email,
          },
          dansals: formattedDansals,
        },
        "User profile retrieved successfully",
      ),
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};
