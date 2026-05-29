import Dansal from "../models/dansal.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
export const addDansal = async (req, res) => {
  try {
    const { description, type, queueLength, imageUrl, location } = req.body;
    const creatorId = req.user.userId; // Assuming the user ID is stored in req.user after authentication

    const newDansal = new Dansal({
      description,
      type,
      queueLength,
      imageUrl,
      location,
      createdBy: creatorId,
    });

    const savedDansal = await newDansal.save();
    return res
      .status(201)
      .json(new ApiResponse(201, null, "Dansal added successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
