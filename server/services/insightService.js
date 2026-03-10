import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Builds the analytics context from live MongoDB data
const buildPrompt = (analytics) => {
  const {
    totalCustomers,
    churnRate,
    churnedCount,
    riskSegments,
    avgChurnProbability,
    topShapFeatures,
    contractBreakdown,
    paymentBreakdown,
    tenureBreakdown,
  } = analytics;

  return `You are a senior customer retention analyst. Analyze this telecom customer dataset and write a concise, actionable retention brief for a business stakeholder.

DATASET SUMMARY:
- Total customers: ${totalCustomers}
- Overall churn rate: ${churnRate}%
- Churned customers: ${churnedCount}
- High risk: ${riskSegments.high} | Medium risk: ${riskSegments.medium} | Low risk: ${riskSegments.low}
- Average churn probability: ${avgChurnProbability}

CONTRACT TYPE BREAKDOWN:
${contractBreakdown.map((c) => `- ${c.contract}: ${c.churnRate}% churn rate (${c.count} customers)`).join("\n")}

PAYMENT METHOD BREAKDOWN (by churned count):
${paymentBreakdown.map((p) => `- ${p.method}: ${p.churnedCount} churned`).join("\n")}

TENURE BREAKDOWN:
${tenureBreakdown.map((t) => `- ${t.group} months tenure: ${t.churnRate}% churn rate`).join("\n")}

TOP CHURN DRIVERS FROM SHAP ANALYSIS:
${topShapFeatures.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Write a retention brief with EXACTLY this structure — no extra text, no preamble:

Start with one opening paragraph (2-3 sentences) summarizing the churn situation with specific numbers.

Key Findings:
- [finding with specific numbers]
- [finding with specific numbers]  
- [finding with specific numbers]

Recommended Actions:
- [specific actionable step]
- [specific actionable step]
- [specific actionable step]

Be specific with numbers. Be direct. No fluff. 150-200 words total.`;
};

// Returns a Groq stream — caller is responsible for consuming it
const streamInsight = async (analytics) => {
  const prompt = buildPrompt(analytics);

  return await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 600,
    stream: true, // ← this is the only difference from before
  });
};

export default {
  buildPrompt,
  streamInsight,
};
