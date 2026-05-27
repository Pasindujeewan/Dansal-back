import mongoose from "mongoose";

const dansalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },
  location: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere", // Geospatial index for location
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Dansal", dansalSchema);
