import { useState } from "react";
import axios from "axios";

export default function Summary() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [summary, setSummary] = useState(null);

  function fetchSummary() {
    axios
      .get(`http://localhost:5000/summary/${year}/${month}`)
      .then(res => setSummary(res.data));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Monthly Summary</h2>

      <input
        type="number"
        placeholder="Year (e.g., 2025)"
        style={{ padding: 6 }}
        onChange={(e) => setYear(e.target.value)}
      />{" "}
      <input
        type="number"
        placeholder="Month (1-12)"
        style={{ padding: 6 }}
        onChange={(e) => setMonth(e.target.value)}
      />{" "}
      <button onClick={fetchSummary}>Get Summary</button>

      {summary && (
        <div style={{ marginTop: 20 }}>
          <h3>Personal Total: {summary.personalTotal}</h3>

          <h3>Category Breakdown</h3>
          <ul>
            {Object.entries(summary.categoryBreak).map(([cat, amt]) => (
              <li key={cat}>{cat}: {amt}</li>
            ))}
          </ul>

          <h3>Group Balances</h3>
          <ul>
            {Object.entries(summary.balances).map(([userId, bal]) => (
              <li key={userId}>
                User {userId}: {bal >= 0 ? `gets ${bal}` : `owes ${Math.abs(bal)}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
