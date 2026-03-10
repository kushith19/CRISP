import express from "express";
import aggregator from "../services/analyticsAggregator.js";
import insight from "../services/insightService.js";
import Dataset from "../models/Dataset.js";

const router = express.Router();

// ── GET /api/insight/cached ───────────────────────────────────────────────
// Called by InsightPanel on every dashboard mount
// Returns stored text instantly — no Groq involved
router.get("/cached", async (req, res) => {
  try {
    const latest = await Dataset.findOne({ insightCache: { $ne: null } })
      .sort({ uploadDate: -1 })
      .select("insightCache insightGeneratedAt customerCount filename");

    if (!latest) {
      return res.json({ insight: null });
    }

    res.json({
      insight:       latest.insightCache,
      generatedAt:   latest.insightGeneratedAt,
      customerCount: latest.customerCount,
      filename:      latest.filename,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/insight/stream ───────────────────────────────────────────────
// Called ONLY from:
//   1. UploadPage — once after ML predictions complete
//   2. InsightPanel Regenerate button
// Never called automatically on dashboard mount
router.get("/stream", async (req, res) => {
  res.setHeader("Content-Type",      "text/event-stream");
  res.setHeader("Cache-Control",     "no-cache");
  res.setHeader("Connection",        "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    const analytics = await aggregator.computeAnalyticsContext();

    if (!analytics) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "No dataset found. Upload a CSV first." })}\n\n`);
      res.end();
      return;
    }

    // Send analytics context first so frontend has it
    res.write(`data: ${JSON.stringify({ type: "context", analytics })}\n\n`);

    // Open Groq stream
    const stream = await insight.streamInsight(analytics);
    let fullInsight = "";
    let isClientConnected = true;

    req.on("close", () => {
      isClientConnected = false;
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) {
        fullInsight += token;
        if (isClientConnected) {
          res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
        }
      }
    }

    // Save completed insight to DB
    if (fullInsight) {
      await Dataset.findOneAndUpdate(
        {},
        {
          insightCache:       fullInsight,
          insightGeneratedAt: new Date(),
        },
        { sort: { uploadDate: -1 } }
      );
      console.log("✅ Insight saved to DB");
    }

    if (isClientConnected) {
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    }

  } catch (err) {
    console.error("Stream error:", err.message);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
      res.end();
    }
  }
});

export default router;