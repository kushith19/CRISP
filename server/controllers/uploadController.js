import fs from "fs";
import { predictBatch } from "../services/mlService.js";
import Dataset from "../models/Dataset.js";
import Prediction from "../models/Prediction.js";

export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Call ML service
    const predictions = await predictBatch(filePath);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Clear previous data — dashboard always shows latest upload only
    await Prediction.deleteMany({});
    await Dataset.deleteMany({});

    // Save dataset metadata — no insightCache yet, that comes after
    const dataset = await Dataset.create({
      filename:      req.file.originalname,
      customerCount: predictions.length,
      uploadDate:    new Date(),
    });

    // Save predictions
    const predictionDocs = predictions.map((pred, index) => {
      const { prediction, churn_probability, risk_level, shap_explanation, ...features } = pred;
      return {
        datasetId:        dataset._id,
        customerIndex:    index,
        customerFeatures: features,
        prediction:       prediction,
        churnProbability: churn_probability,
        riskLevel:        risk_level,
        shapExplanation:  (shap_explanation ?? []).map((s) => ({
          feature:   s.feature,
          shapValue: s.shap_value,
          direction: s.direction,
        })),
      };
    });

    await Prediction.insertMany(predictionDocs);

    // Return immediately — insight generation happens separately
    // triggered by UploadPage after this response
    res.status(201).json({
      message:       "Dataset processed successfully",
      datasetId:     dataset._id,
      customerCount: predictions.length,
    });

  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
};