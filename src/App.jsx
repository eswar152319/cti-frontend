import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [tab, setTab] = useState("analyst");
  const [selected, setSelected] = useState(null);
  const [minScore, setMinScore] = useState(0);

  // fetch alerts on mount
  useEffect(() => {
    fetch(`${API_BASE}/alerts?top=20`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => setAlerts(data.alerts || []))
      .catch((err) => {
        console.error("fetch alerts failed", err);
        // dummy fallback
        setAlerts(
          Array.from({ length: 20 }).map((_, i) => ({
            indicator: `malicious-domain-${i + 1}.com`,
            source: i % 2 === 0 ? "ThreatFeed A" : "ThreatFeed B",
            cve: i % 3 === 0 ? `CVE-2025-00${i}` : "",
            risk_score: Math.floor(Math.random() * 100),
            state: i % 4 === 0 ? "open" : "investigating",
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            enrichment: {
              country: i % 2 === 0 ? "US" : "IN",
              ip: `192.168.${i}.45`,
              reputation: i % 2 === 0 ? "high risk" : "medium risk",
              first_seen: `2025-09-${10 + i}`,
              campaigns: i % 5 === 0 ? ["APT-X", "DarkOps"] : ["—"],
            },
          }))
        );
      });
  }, []);

  // simulate AI alerts locally
  function generateAiAlerts() {
    const fakeAlerts = Array.from({ length: 10 }).map((_, i) => ({
      indicator: `ai-generated-malicious-${i + 1}.com`,
      source: "AI Engine",
      cve: i % 3 === 0 ? `CVE-2025-${i}` : "",
      risk_score: Math.floor(Math.random() * 100),
      state: i % 4 === 0 ? "open" : "investigating",
      timestamp: new Date().toISOString(),
      enrichment: {
        country: i % 2 === 0 ? "RU" : "US",
        ip: `203.0.113.${i + 10}`,
        reputation: i % 2 === 0 ? "high risk" : "medium risk",
        first_seen: new Date().toISOString(),
        campaigns: ["AI ThreatX"],
      },
    }));
    setAlerts(fakeAlerts);
  }

  function executePlaybook(indicator, action) {
    fetch(`${API_BASE}/playbook/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indicator, action }),
    })
      .then((res) => res.json())
      .then((data) => alert(`Playbook: ${data.status}`))
      .catch((err) => alert("Playbook failed: " + err.message));
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          CTI Frontend – {new Date().toLocaleString()}
        </h1>
        <button onClick={generateAiAlerts}>⚡ AI Fetch</button>
      </header>

      <div className="tabs">
        <button
          className={tab === "analyst" ? "active" : ""}
          onClick={() => setTab("analyst")}
        >
          Analyst
        </button>
        <button
          className={tab === "ciso" ? "active" : ""}
          onClick={() => setTab("ciso")}
        >
          CISO
        </button>
        <button
          className={tab === "ops" ? "active" : ""}
          onClick={() => setTab("ops")}
        >
          Operations
        </button>
      </div>

      {tab === "analyst" && (
        <AnalystView
          alerts={alerts}
          selected={selected}
          minScore={minScore}
          onSelect={(a) => setSelected(a)}
          onScoreChange={(score) => setMinScore(score)}
        />
      )}

      {tab === "ciso" && <CisoView alerts={alerts} />}

      {tab === "ops" && (
        <OpsView selected={selected} onAction={executePlaybook} />
      )}
    </div>
  );
}

/** Analyst tab */
function AnalystView({ alerts, selected, minScore, onSelect, onScoreChange }) {
  const now = Date.now();
  return (
    <div className="analyst-container">
      <div className="alerts-table">
        <input
          className="slider"
          type="range"
          min="0"
          max="100"
          value={minScore}
          onChange={(e) => onScoreChange(Number(e.target.value))}
        />
        <table>
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Source</th>
              <th>CVE</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts
              .filter((a) => a.risk_score >= minScore)
              .map((a, i) => {
                const t = new Date(a.timestamp).getTime();
                const diff = (now - t) / 1000 / 60 / 60;
                const isNew = diff <= 1;
                return (
                  <tr
                    key={i}
                    onClick={() => onSelect(a)}
                    className={selected === a ? "selected" : ""}
                  >
                    <td>
                      {a.indicator}
                      {isNew && <span className="new-badge">NEW</span>}
                    </td>
                    <td>{a.source}</td>
                    <td>{a.cve}</td>
                    <td>
                      <span
                        className={`score-badge ${
                          a.risk_score > 70
                            ? "score-high"
                            : a.risk_score > 40
                            ? "score-medium"
                            : "score-low"
                        }`}
                      >
                        {a.risk_score}
                      </span>
                    </td>
                    <td>{a.state}</td>
                    <td>{new Date(a.timestamp).toLocaleString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="alert-details">
        {selected ? (
          <>
            <h3>{selected.indicator}</h3>
            <p>
              <strong>IP:</strong> {selected.enrichment?.ip}
            </p>
            <p>
              <strong>Country:</strong> {selected.enrichment?.country}
            </p>
            <p>
              <strong>Reputation:</strong> {selected.enrichment?.reputation}
            </p>
            <p>
              <strong>First Seen:</strong> {selected.enrichment?.first_seen}
            </p>
            <p>
              <strong>Campaigns:</strong>{" "}
              {selected.enrichment?.campaigns?.join(", ")}
            </p>
          </>
        ) : (
          <p>Select an alert to view details.</p>
        )}
      </div>
    </div>
  );
}

/** CISO tab with charts + card layout for filtered alerts */
function CisoView({ alerts }) {
  const [filter, setFilter] = useState("all");

  const sourceCounts = alerts.reduce((acc, a) => {
    acc[a.source] = (acc[a.source] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(sourceCounts).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  const lineData = alerts.map((a, i) => ({
    index: i + 1,
    score: a.risk_score,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  let filteredAlerts = alerts;
  if (filter === "high") {
    filteredAlerts = alerts.filter((a) => a.risk_score > 70);
  } else if (filter === "unique") {
    const seen = new Set();
    filteredAlerts = alerts.filter((a) => {
      if (seen.has(a.source)) return false;
      seen.add(a.source);
      return true;
    });
  }

  return (
    <div className="ciso-view">
      <div className="metrics">
        <div className="card" onClick={() => setFilter("all")}>
          <h3>Total Alerts</h3>
          <p>{alerts.length}</p>
        </div>
        <div className="card" onClick={() => setFilter("high")}>
          <h3>High Risk &gt; 70</h3>
          <p>{alerts.filter((a) => a.risk_score > 70).length}</p>
        </div>
        <div className="card" onClick={() => setFilter("unique")}>
          <h3>Unique Sources</h3>
          <p>{Object.keys(sourceCounts).length}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart" style={{ width: "50%", height: 300 }}>
          <h3>Alerts by Source</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart" style={{ width: "50%", height: 300 }}>
          <h3>Risk Score Trend</h3>
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* separate card grid for filtered alerts */}
      <div className="highrisk-box">
        <h3>
          Showing:{" "}
          {filter === "all"
            ? "All Alerts"
            : filter === "high"
            ? "High Risk Alerts"
            : "Unique Source Alerts"}
        </h3>

        <div className="alert-cards">
          {filteredAlerts.map((a, idx) => (
            <div
              className={
                a.risk_score > 70
                  ? "alert-card high"
                  : "alert-card"
              }
              key={idx}
            >
              <h4>{a.indicator}</h4>
              <p>
                <strong>Source:</strong> {a.source}
              </p>
              <p>
                <strong>Risk:</strong> {a.risk_score}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {a.timestamp
                  ? new Date(a.timestamp).toLocaleString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Ops tab */
function OpsView({ selected, onAction }) {
  if (!selected)
    return (
      <div className="ops-view">
        <p>Select an alert in Analyst view first.</p>
      </div>
    );
  return (
    <div className="ops-view">
      <h3>Mitigation Actions for {selected.indicator}</h3>
      <div className="ops-buttons">
        <button onClick={() => onAction(selected.indicator, "block")}>
          Block Indicator
        </button>
        <button onClick={() => onAction(selected.indicator, "isolate")}>
          Isolate Host
        </button>
        <button onClick={() => onAction(selected.indicator, "mark_safe")}>
          Mark Safe
        </button>
      </div>
    </div>
  );
}
