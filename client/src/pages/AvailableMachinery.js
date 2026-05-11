import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function AvailableMachinery() {
  const currentUser = sessionStorage.getItem("userEmail");

  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const fetchMachinery = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/farmerdashboard/available-machinery");
      setMachinery(response.data);
    } catch (err) {
      console.error("Error fetching available machinery:", err);
      setError(err.response?.data?.error || "Unable to fetch available machinery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, []);

  const handleRent = async (machineryId) => {
    if (!currentUser) {
      alert("Please login again. User email is missing.");
      return;
    }

    try {
      setSavingId(machineryId);
      await api.post("/farmerdashboard/rent-machinery", {
        machinery_id: machineryId,
        renter_id: currentUser,
      });
      alert("Machinery rented successfully.");
      await fetchMachinery();
    } catch (err) {
      console.error("Error renting machinery:", err);
      alert(err.response?.data?.error || "Unable to rent machinery.");
    } finally {
      setSavingId(null);
    }
  };

  const avgPrice =
    machinery.length > 0
      ? machinery.reduce((sum, item) => sum + Number(item.price_per_day), 0) /
        machinery.length
      : 0;

  return (
    <div className="dashboard-page-container">
      <h1>Available Machinery</h1>
      <p>Browse machinery available for rent.</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Available</h3>
          <div className="value">{machinery.length}</div>
        </div>
        <div className="info-card">
          <h3>Owners</h3>
          <div className="value">
            {new Set(machinery.map((item) => item.farmer_id)).size}
          </div>
        </div>
        <div className="info-card">
          <h3>Avg. Price/Day</h3>
          <div className="value">₹{Math.round(avgPrice).toLocaleString()}</div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Available Equipment Catalog</h2>
      {loading ? (
        <p>Loading available machinery...</p>
      ) : machinery.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Owner</th>
                <th>Price/Day</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {machinery.map((item) => (
                <tr key={item.machinery_id}>
                  <td>{item.name}</td>
                  <td>{item.owner_name}</td>
                  <td>₹{Number(item.price_per_day).toLocaleString()}</td>
                  <td>{item.location || "-"}</td>
                  <td>{Number(item.average_rating).toFixed(1)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRent(item.machinery_id)}
                      disabled={savingId === item.machinery_id}
                    >
                      {savingId === item.machinery_id ? "Renting..." : "Rent"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No machinery is available right now.</p>
        </div>
      )}
    </div>
  );
}
