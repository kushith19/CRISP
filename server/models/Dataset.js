import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    customerCount: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },

    // Cache for insight generation
    insightCache:         { type: String, default: null },
  insightGeneratedAt:   { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Dataset", datasetSchema);
