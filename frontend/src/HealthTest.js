import { useEffect, useState } from "react";
import { getHealth } from "./api";

export default function HealthTest() {
  const [status, setStatus] = useState("Checking backend...");
  const [error, setError] = useState(null);

  useEffect(() => {
    getHealth()
      .then((data) => {
        setStatus(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch backend health");
      });
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>TaxMate Frontend</h1>
      <p>
        Backend Status:
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{error || status}</pre>
      </p>
    </div>
  );
}
