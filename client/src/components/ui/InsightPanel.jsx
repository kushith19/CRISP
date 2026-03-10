import { useState, useEffect, useRef } from "react";
import {
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

function parseInsight(text) {
  if (!text) return null;
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const result = { opening: [], findings: [], actions: [] };
  let section = "opening";

  lines.forEach((line) => {
    if (/key finding/i.test(line)) {
      section = "findings";
      return;
    }
    if (/recommended action/i.test(line)) {
      section = "actions";
      return;
    }
    const bullet = line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "");
    if (!bullet) return;
    result[section].push(bullet);
  });

  return {
    opening: result.opening.join(" "),
    findings: result.findings.slice(0, 3),
    actions: result.actions.slice(0, 3),
  };
}

function Section({ items, type }) {
  const isRisk = type === "findings";
  const headerIcon = isRisk ? (
    <AlertCircle size={16} color="var(--danger, #ef4444)" />
  ) : (
    <CheckCircle2 size={16} color="var(--success, #22c55e)" />
  );
  const label = isRisk ? "Key Findings" : "Recommended Actions";

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {headerIcon}
        <h4
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </h4>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
          >
            <span
              style={{
                minWidth: "20px",
                color: "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {i + 1}.
            </span>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InsightPanel() {
  const [status, setStatus] = useState("idle");
  const [insightText, setInsightText] = useState("");
  const [streamText, setStreamText] = useState("");
  const [meta, setMeta] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const esRef = useRef(null);
  const streamBufferRef = useRef("");

  useEffect(() => {
    fetchCached();
  }, []);

  const fetchCached = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/insight/cached");
      const data = await res.json();

      if (data.insight) {
        setInsightText(data.insight);
        setMeta({
          generatedAt: data.generatedAt,
          filename: data.filename,
          customerCount: data.customerCount,
        });
        setStatus("ready");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  const regenerate = () => {
    if (esRef.current) esRef.current.close();

    streamBufferRef.current = "";
    setStreamText("");
    setStatus("streaming");
    setErrorMsg("");

    const es = new EventSource("/api/insight/stream");
    esRef.current = es;

    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "token") {
        streamBufferRef.current += msg.token;
        setStreamText((prev) => prev + msg.token);
      }

      if (msg.type === "done") {
        setInsightText(streamBufferRef.current);
        streamBufferRef.current = "";
        setStreamText("");
        setStatus("ready");
        es.close();
        fetchCached();
      }

      if (msg.type === "error") {
        setErrorMsg(msg.message);
        setStatus("error");
        es.close();
      }
    };

    es.onerror = () => {
      setErrorMsg("Connection lost. Try again.");
      setStatus("error");
      es.close();
    };
  };

  const displayText = status === "streaming" ? streamText : insightText;
  const parsed = parseInsight(displayText);

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(168,85,247,0.3)",
        background:
          "linear-gradient(135deg, rgba(168,85,247,0.03) 0%, rgba(124,58,237,0.03) 100%)",
        boxShadow: "0 4px 20px -2px rgba(168,85,247,0.05)",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          borderBottom: expanded ? "1px solid rgba(168,85,247,0.15)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a855f7",
            }}
          >
            <Lightbulb size={16} />
          </div>
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 2px 0",
              }}
            >
              Strategic Insights
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {status === "idle" && "No dataset active"}
              {status === "loading" && "Loading analysis..."}
              {status === "streaming" && "Processing data..."}
              {status === "error" && "Analysis unavailable"}
              {status === "ready" && meta && `Source: ${meta.filename}`}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {(status === "ready" || status === "error") && (
            <button
              onClick={regenerate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "4px",
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.2)",
                color: "#a855f7",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <RefreshCw size={12} /> Refresh
            </button>
          )}

          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {expanded && (
        <div>
          {status === "idle" && (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <Info
                size={24}
                color="var(--text-muted)"
                style={{ margin: "0 auto 12px" }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Upload a dataset to view strategic insights and recommendations
              </p>
            </div>
          )}

          {status === "loading" && (
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[100, 85, 90, 65].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 12,
                    borderRadius: 2,
                    width: `${w}%`,
                    background: "var(--bg-secondary)",
                  }}
                />
              ))}
            </div>
          )}

          {status === "error" && (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <AlertCircle
                size={24}
                color="var(--danger)"
                style={{ margin: "0 auto 12px" }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                {errorMsg}
              </p>
              <button
                onClick={regenerate}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Retry Analysis
              </button>
            </div>
          )}

          {(status === "ready" || status === "streaming") && (
            <div style={{ padding: "24px" }}>
              {parsed?.opening && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {parsed.opening}
                </div>
              )}

              {status === "streaming" && !parsed?.opening && streamText && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {streamText}
                </div>
              )}

              {(parsed?.findings.length > 0 || parsed?.actions.length > 0) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {parsed.findings.length > 0 && (
                    <Section items={parsed.findings} type="findings" />
                  )}
                  {parsed.actions.length > 0 && (
                    <Section items={parsed.actions} type="actions" />
                  )}
                </div>
              )}

              {status === "ready" && meta?.generatedAt && (
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    marginTop: "24px",
                    paddingTop: "16px",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Records Analyzed:{" "}
                    {meta.customerCount?.toLocaleString() || "N/A"}
                  </span>
                  <span>
                    Last updated: {new Date(meta.generatedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
