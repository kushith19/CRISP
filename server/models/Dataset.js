import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  customerCount: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Dataset', datasetSchema);