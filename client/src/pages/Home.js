import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Home() {
  const farmerId = sessionStorage.getItem("userEmail");
  const [summary, setSummary] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    if (!farmerId) {
      setError("Farmer email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/farmerdashboard/summary?farmer_id=${encodeURIComponent(farmerId)}`
      );
      setSummary(response.data);
      setDescription(response.data.description || "");
    } catch (err) {
      console.error("Error fetching farmer summary:", err);
      setError(err.response?.data?.error || "Unable to fetch dashboard summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.patch("/farmerdashboard/profile", {
        farmer_id: farmerId,
        description,
      });
      alert("Description updated successfully.");
      await fetchSummary();
    } catch (err) {
      console.error("Error updating description:", err);
      alert(err.response?.data?.error || "Unable to update description.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page-container">
      <h1>Welcome to Farmer Dashboard</h1>
      <p>Farmer ID: {farmerId || "Not logged in"}</p>

      {loading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <>
          <div className="dashboard-info-grid">
            <div className="info-card">
              <h3>Total Products Listed</h3>
              <div className="value">{summary.total_products}</div>
            </div>
            <div className="info-card">
              <h3>Average Rating</h3>
              <div className="value">{Number(summary.average_rating).toFixed(1)}</div>
            </div>
            <div className="info-card">
              <h3>Total Reviews</h3>
              <div className="value">{summary.rating_count}</div>
            </div>
            <div className="info-card">
              <h3>Units Sold</h3>
              <div className="value">{summary.total_units_sold}</div>
            </div>
          </div>

          <h2>Your Performance Summary</h2>
          <p>Total Sales: ₹{Number(summary.total_sales).toLocaleString()}</p>
          <p>{summary.description}</p>

          <h2>Farmer Profile Description</h2>
          <form className="dashboard-form" onSubmit={handleDescriptionSubmit}>
            <label htmlFor="description">Update Your Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Description"}
            </button>
          </form>
        </>
      )}

      <h2>Quick Links</h2>
      <ul className="item-list">
        <li>Add New Product: List your agricultural products for sale</li>
        <li>Manage Machinery: Add or update your available equipment</li>
        <li>Contact Details: Keep your information updated</li>
        <li>View Reviews: See what customers say about your products</li>
      </ul>
    </div>
  );
}
