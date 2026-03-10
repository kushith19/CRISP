import dotenv from "dotenv";
dotenv.config()
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import insightRoutes from './routes/insightRoutes.js';

const app = express();


connectDB();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));



app.use('/api', uploadRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', customerRoutes);
app.use('/api/insight', insightRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
