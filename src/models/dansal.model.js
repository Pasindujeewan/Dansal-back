import mongoose from "mongoose";

const dansalSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
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
dansalSchema.index({ location: "2dsphere" }); // Geospatial index for location

export default mongoose.model("Dansal", dansalSchema);
