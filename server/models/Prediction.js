import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' },
  customerIndex: { type: Number },
  customerFeatures: { type: mongoose.Schema.Types.Mixed, default: {} },
  prediction: { type: Number },            
  churnProbability: { type: Number },        
  riskLevel: { type: String, enum: ['High', 'Medium', 'Low'] },
  shapExplanation: [
    {
      feature:   { type: String },
      shapValue: { type: Number },
      direction: { type: String },
    }
    ],
}, { timestamps: true });

predictionSchema.index({ riskLevel: 1 });
predictionSchema.index({ churnProbability: -1 });
predictionSchema.index({ datasetId: 1 });

export default mongoose.model('Prediction', predictionSchema);