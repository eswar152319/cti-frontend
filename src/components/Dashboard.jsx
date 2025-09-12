// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";

const mockThreats = [
  { id: 1, name: "CVE-2024-3400", severity: "Critical", type: "Vulnerability" },
  { id: 2, name: "Malware Campaign XYZ", severity: "High", type: "Malware" },
  { id: 3, name: "Phishing Attack ABC", severity: "Medium", type: "Phishing" },
];

const Dashboard = ({ role }) => {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    setThreats(mockThreats);
    const interval = setInterval(() => {
      setThreats((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: `New Threat ${prev.length + 1}`,
          severity: ["Low", "Medium", "High", "Critical"][Math.floor(Math.random() * 4)],
          type: ["Vulnerability", "Malware", "Phishing"][Math.floor(Math.random() * 3)],
        },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredThreats = threats.filter((t) => {
    if (role === "Leadership") return t.severity === "Critical" || t.severity === "High";
    if (role === "Operations") return t.severity !== "Low";
    return true;
  });

  return (
    <div style={{ margin: "20px" }}>
      <h2>{role} Dashboard</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Severity</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredThreats.map((threat) => (
            <tr key={threat.id}>
              <td>{threat.id}</td>
              <td>{threat.name}</td>
              <td>{threat.severity}</td>
              <td>{threat.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
