import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import RoleSelector from "./components/RoleSelector";

function App() {
  const [role, setRole] = useState("Analyst");

  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        AI-Powered Cyber Threat Intelligence
      </h1>
      <RoleSelector role={role} setRole={setRole} />
      <Dashboard role={role} />
    </div>
  );
}

export default App;
