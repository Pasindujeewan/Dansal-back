import mongoose from "mongoose";
import { allowedDansalTypes } from "../constants/allowedDansal.js";

const dansalSchema = new mongoose.Schema(
  {
    type: {
      label: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
        enum: allowedDansalTypes,
      },
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
        type: [Number],
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
  },
  {
    timestamps: true,
  },
);

dansalSchema.index({ location: "2dsphere" });

const Dansal = mongoose.models.Dansal || mongoose.model("Dansal", dansalSchema);

export default Dansal;
