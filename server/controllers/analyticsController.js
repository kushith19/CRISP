import Prediction from '../models/Prediction.js';
import Dataset from '../models/Dataset.js';

export const getAnalytics = async (req, res) => {
  try {
    const totalCustomers = await Prediction.countDocuments();

    if (totalCustomers === 0) {
      return res.json({
        totalCustomers: 0,
        churnRate: 0,
        riskSegments: { high: 0, medium: 0, low: 0 },
        avgChurnProbability: 0,
        chartData: {},
      });
    }

    // Churn rate
    const churnedCount = await Prediction.countDocuments({ prediction: 1 });
    const churnRate = ((churnedCount / totalCustomers) * 100).toFixed(1);

    // Risk segments
    const highRisk = await Prediction.countDocuments({ riskLevel: 'High' });
    const mediumRisk = await Prediction.countDocuments({ riskLevel: 'Medium' });
    const lowRisk = await Prediction.countDocuments({ riskLevel: 'Low' });

    // Average churn probability
    const avgResult = await Prediction.aggregate([
      { $group: { _id: null, avg: { $avg: '$churnProbability' } } }
    ]);
    const avgChurnProbability = avgResult[0]?.avg?.toFixed(3) || 0;

    // Chart data: churn by contract type
    const contractData = await Prediction.aggregate([
      {
        $group: {
          _id: { contract: '$customerFeatures.Contract', churned: '$prediction' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Chart data: churn by payment method
    const paymentData = await Prediction.aggregate([
      {
        $group: {
          _id: { payment: '$customerFeatures.PaymentMethod', churned: '$prediction' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Tenure distribution
    const tenureData = await Prediction.aggregate([
      {
        $bucket: {
          groupBy: '$customerFeatures.tenure',
          boundaries: [0, 12, 24, 36, 48, 60, 72],
          default: '72+',
          output: {
            churnCount: { $sum: '$prediction' },
            totalCount: { $sum: 1 }
          }
        }
      }
    ]);

    // Scatter data: MonthlyCharges vs churnProbability (sample up to 300)
    const scatterData = await Prediction.aggregate([
      { $match: { 'customerFeatures.MonthlyCharges': { $exists: true } } },
      { $sample: { size: 300 } },
      {
        $project: {
          charges: '$customerFeatures.MonthlyCharges',
          probability: '$churnProbability',
          _id: 0
        }
      }
    ]);

    res.json({
      totalCustomers,
      churnRate: parseFloat(churnRate),
      churnedCount,
      riskSegments: { high: highRisk, medium: mediumRisk, low: lowRisk },
      avgChurnProbability: parseFloat(avgChurnProbability),
      chartData: {
        contractData,
        paymentData,
        tenureData,
        scatterData,
        pieData: [
          { name: 'Churned',  value: churnedCount },
          { name: 'Retained', value: totalCustomers - churnedCount },
        ],
        riskData: [
          { name: 'High',   value: highRisk },
          { name: 'Medium', value: mediumRisk },
          { name: 'Low',    value: lowRisk },
        ],
      },
    });

  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({ error: error.message });
  }
};