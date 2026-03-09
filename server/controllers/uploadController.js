import fs from "fs";
import path from "path";
import { predictBatch } from "../services/mlService.js";
import Dataset from "../models/Dataset.js";
import Prediction from "../models/Prediction.js";

export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Call ML service with the CSV
    const predictions = await predictBatch(filePath);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Clear previous data so dashboard only shows the latest upload
    await Prediction.deleteMany({});
    await Dataset.deleteMany({});

    // Save dataset metadata
    const dataset = await Dataset.create({
      filename: req.file.originalname,
      customerCount: predictions.length,
      uploadDate: new Date(),
    });

    // Save predictions in bulk
    const predictionDocs = predictions.map((pred, index) => {
      // ML service returns flat objects – separate ML outputs from customer features
      const { prediction, churn_probability, risk_level, ...features } = pred;
      return {
        datasetId: dataset._id,
        customerIndex: index,
        customerFeatures: features,
        prediction: prediction,
        churnProbability: churn_probability,
        riskLevel: risk_level,
        shapExplanation: (pred.shap_explanation ?? []).map((s) => ({
          feature: s.feature,
          shapValue: s.shap_value,
          direction: s.direction,
        })),
      };
    });

    await Prediction.insertMany(predictionDocs);

    res.status(201).json({
      message: "Dataset processed successfully",
      datasetId: dataset._id,
      customerCount: predictions.length,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
