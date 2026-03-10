import Prediction from "../models/Prediction.js";

const computeAnalyticsContext = async () => {
  const predictions = await Prediction.find({}).lean();

  if (!predictions.length) return null;

  const total = predictions.length;
  const churned = predictions.filter((p) => p.prediction === 1);

  // Risk segments
  const high = predictions.filter((p) => p.riskLevel === "High").length;
  const medium = predictions.filter((p) => p.riskLevel === "Medium").length;
  const low = predictions.filter((p) => p.riskLevel === "Low").length;

  const avgProb = (
    predictions.reduce((s, p) => s + (p.churnProbability || 0), 0) / total
  ).toFixed(3);

  // Contract breakdown
  const contractMap = {};
  predictions.forEach((p) => {
    const c = p.customerFeatures?.Contract || "Unknown";
    if (!contractMap[c]) contractMap[c] = { total: 0, churned: 0 };
    contractMap[c].total++;
    if (p.prediction === 1) contractMap[c].churned++;
  });
  const contractBreakdown = Object.entries(contractMap).map(
    ([contract, v]) => ({
      contract,
      count: v.total,
      churnRate: ((v.churned / v.total) * 100).toFixed(1),
    }),
  );

  // Payment breakdown
  const paymentMap = {};
  predictions.forEach((p) => {
    const m = p.customerFeatures?.PaymentMethod || "Unknown";
    if (!paymentMap[m]) paymentMap[m] = 0;
    if (p.prediction === 1) paymentMap[m]++;
  });
  const paymentBreakdown = Object.entries(paymentMap)
    .map(([method, churnedCount]) => ({ method, churnedCount }))
    .sort((a, b) => b.churnedCount - a.churnedCount);

  // Tenure breakdown
  const buckets = {
    "0-12": { t: 0, c: 0 },
    "13-24": { t: 0, c: 0 },
    "25-48": { t: 0, c: 0 },
    "49+": { t: 0, c: 0 },
  };
  predictions.forEach((p) => {
    const tenure = parseFloat(p.customerFeatures?.tenure || 0);
    const key =
      tenure <= 12
        ? "0-12"
        : tenure <= 24
          ? "13-24"
          : tenure <= 48
            ? "25-48"
            : "49+";
    buckets[key].t++;
    if (p.prediction === 1) buckets[key].c++;
  });
  const tenureBreakdown = Object.entries(buckets).map(([group, v]) => ({
    group,
    churnRate: v.t > 0 ? ((v.c / v.t) * 100).toFixed(1) : "0",
  }));

  // Top SHAP features across all customers
  const shapCount = {};
  predictions.forEach((p) => {
    (p.shapExplanation || []).forEach((s) => {
      if (s.direction === "increases_churn") {
        shapCount[s.feature] = (shapCount[s.feature] || 0) + 1;
      }
    });
  });
  const topShapFeatures = Object.entries(shapCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([feature, count]) => `${feature} (cited for ${count} customers)`);

  return {
    totalCustomers: total,
    churnRate: ((churned.length / total) * 100).toFixed(1),
    churnedCount: churned.length,
    riskSegments: { high, medium, low },
    avgChurnProbability: avgProb,
    topShapFeatures,
    contractBreakdown,
    paymentBreakdown,
    tenureBreakdown,
  };
};

export default {
  computeAnalyticsContext,
};
