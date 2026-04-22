import React, { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/history')
      .then(res => setReports(res.data))
      .catch(err => console.error("Error fetching history", err));
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Recent Reports</h2>
      {reports.length === 0 ? (
        <p>No reports found. Go analyze something!</p>
      ) : (
        reports.map((report, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <p><b>Date:</b> {new Date(report.timestamp).toLocaleString()}</p>
            <p><b>Drugs:</b> {report.analysis.drugs.join(', ')}</p>
            <p><i>"{report.text.substring(0, 100)}..."</i></p>
          </div>
        ))
      )}
    </div>
  );
}