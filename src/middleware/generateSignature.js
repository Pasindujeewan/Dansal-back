import cloudinary from "cloudinary";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateSignature = (req, res, next) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "dansal-app",
        upload_preset: "dansal-images",
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          signature,
          timestamp,
          apiKey: process.env.CLOUDINARY_API_KEY,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        },
        "Signature generated successfully",
      ),
    );
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Error generating signature", "SIGNATURE_ERROR"),
    );
  }
};
export default generateSignature;
