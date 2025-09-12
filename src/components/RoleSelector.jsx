// src/components/RoleSelector.jsx
import React from "react";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <label>Select Role: </label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Leadership">Leadership</option>
        <option value="Analyst">Analyst</option>
        <option value="Operations">Operations</option>
      </select>
    </div>
  );
};

export default RoleSelector;
