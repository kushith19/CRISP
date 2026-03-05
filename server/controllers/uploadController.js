import fs from 'fs';
import path from 'path';
import mlService from '../services/mlService.js';
import Dataset from '../models/Dataset.js';
import Prediction from '../models/Prediction.js';

export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Call ML service with the CSV
    const predictions = await mlService.predictBatch(filePath);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Save dataset metadata
    const dataset = await Dataset.create({
      filename: req.file.originalname,
      customerCount: predictions.length,
      uploadDate: new Date(),
    });

    // Save predictions in bulk
    const predictionDocs = predictions.map((pred, index) => ({
      datasetId: dataset._id,
      customerIndex: index,
      customerFeatures: pred.features || {},
      prediction: pred.prediction,
      churnProbability: pred.churn_probability,
      riskLevel: pred.risk_level,
    }));

    await Prediction.insertMany(predictionDocs);

    res.status(201).json({
      message: 'Dataset processed successfully',
      datasetId: dataset._id,
      customerCount: predictions.length,
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: error.message });
  }
};