import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated fetch
  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      try {
        // Mock alerts data
        const payload = {
          alerts: [
            {
              indicator: "1.2.3.4",
              source: "Shodan",
              cve: "CVE-2024-1234",
              risk_score: 85,
              state: "open",
              enrichment: { country: "US" },
              analysis: "Critical IP, scanning the internet",
            },
            {
              indicator: "malicious.com",
              source: "VirusTotal",
              cve: null,
              risk_score: 45,
              state: "closed",
              enrichment: { category: "phishing" },
              analysis: "Phishing domain detected",
            },
          ],
        };
        setAlerts(payload.alerts);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h2>CTI Dashboard</h2>
      </header>

      <div className="analyst-container">
        <div className="alerts-table">
          <h3>Alerts</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Indicator</th>
                  <th>Source</th>
                  <th>CVE</th>
                  <th>Score</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedAlert(a)}
                    className={selectedAlert === a ? "selected" : ""}
                  >
                    <td>{a.indicator}</td>
                    <td>{a.source}</td>
                    <td>{a.cve || "-"}</td>
                    <td>
                      <span
                        className={`score-badge ${
                          a.risk_score >= 70
                            ? "score-high"
                            : a.risk_score >= 40
                            ? "score-medium"
                            : "score-low"
                        }`}
                      >
                        {a.risk_score}
                      </span>
                    </td>
                    <td>{a.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="alert-details">
          <h3>Details</h3>
          {selectedAlert ? (
            <div>
              <p>
                <b>Indicator:</b> {selectedAlert.indicator}
              </p>
              <p>
                <b>Source:</b> {selectedAlert.source}
              </p>
              <p>
                <b>CVE:</b> {selectedAlert.cve || "N/A"}
              </p>
              <p>
                <b>Risk Score:</b> {selectedAlert.risk_score}
              </p>
              <p>
                <b>Analysis:</b> {selectedAlert.analysis}
              </p>
              <pre>{JSON.stringify(selectedAlert.enrichment, null, 2)}</pre>
            </div>
          ) : (
            <p>Select an alert to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
