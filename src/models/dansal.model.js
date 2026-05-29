import mongoose from "mongoose";

const dansalSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere", // Geospatial index for location
  },
  imageUrl: {
    type: String,
    default: null,
  },
  queueLength: {
    type: String,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Dansal", dansalSchema);
