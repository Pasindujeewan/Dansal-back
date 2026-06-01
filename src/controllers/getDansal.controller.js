import Dansal from "../models/dansal.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDansal = async (req, res) => {
  try {
    const { north, south, east, west } = req.query;
    const dansals = await Dansal.find({
      location: {
        $geoWithin: {
          $box: [
            [west, south],
            [east, north],
          ],
        },
      },
    }).select("location type "); // Select only necessary fields
    const formattedDansals = dansals.map((dansal) => ({
      id: dansal._id,
      type: dansal.type,
      coordinates: dansal.location.coordinates,
    }));
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { dansals: formattedDansals },
          "Dansals fetched successfully",
        ),
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch dansals"));
  }
};
