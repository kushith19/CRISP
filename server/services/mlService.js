import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const predictBatch = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${ML_SERVICE_URL}/predict-batch`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 120000, // 2 min timeout for large datasets
    });

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('ML service is not running. Please start the FastAPI service.');
    }
    throw new Error(`ML service error: ${error.response?.data?.detail || error.message}`);
  }
};