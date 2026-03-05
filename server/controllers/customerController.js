import Prediction from '../models/Prediction.js';

export const getCustomers = async (req, res) => {
  try {
    const { riskLevel, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (riskLevel && riskLevel !== 'all') {
      filter.riskLevel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const customers = await Prediction.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ churnProbability: -1 })
      .lean();

    const total = await Prediction.countDocuments(filter);

    res.json({
      customers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Prediction.findById(req.params.id).lean();
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};