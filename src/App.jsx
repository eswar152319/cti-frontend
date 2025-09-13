import React, { useState } from "react";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8000"; // change if backend on other port

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // try real backend
      const res = await fetch(`${API_BASE}/alerts?top=10`);
      if (!res.ok) throw new Error("Backend not responding");
      const data = await res.json();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (e) {
      // fallback dummy data
      setAlerts([
        {
          indicator: "malware.example.com",
          source: "ThreatIntel",
          cve: "CVE-2025-1234",
          risk_score: 85,
          state: "Open",
          enrichment: { ip: "10.0.0.1" }
        },
        {
          indicator: "phish.example.net",
          source: "User Report",
          cve: null,
          risk_score: 45,
          state: "Open",
          enrichment: {}
        }
      ]);
      setError("Using dummy data (backend not reachable)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>
        CTI Frontend
      </h1>
      <button
        onClick={fetchAlerts}
        style={{
          padding: "10px 16px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {loading ? "Loading..." : "Call Backend"}
      </button>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      {alerts.length === 0 && !loading && (
        <p>No alerts loaded yet. Click the button above.</p>
      )}

      {alerts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px"
          }}
        >
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                background: "#f9fafb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              <h3 style={{ marginTop: 0 }}>{alert.indicator}</h3>
              <p>
                <strong>Source:</strong> {alert.source}
              </p>
              <p>
                <strong>CVE:</strong> {alert.cve || "N/A"}
              </p>
              <p>
                <strong>Risk Score:</strong> {alert.risk_score}
              </p>
              <p>
                <strong>Status:</strong> {alert.state}
              </p>
              {alert.enrichment?.ip && (
                <p>
                  <strong>IP:</strong> {alert.enrichment.ip}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
