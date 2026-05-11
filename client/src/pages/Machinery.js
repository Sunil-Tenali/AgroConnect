import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Machinery() {
  const farmerId = sessionStorage.getItem("userEmail");

  const [machinery, setMachinery] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_per_day: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchMachinery = async () => {
    if (!farmerId) {
      setError("Farmer email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/farmerdashboard/machinery?farmer_id=${encodeURIComponent(farmerId)}`
      );
      setMachinery(response.data);
    } catch (err) {
      console.error("Error fetching machinery:", err);
      setError(err.response?.data?.error || "Unable to fetch machinery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.post("/farmerdashboard/machinery", {
        farmer_id: farmerId,
        ...formData,
        price_per_day: Number(formData.price_per_day),
      });
      alert("Machinery added successfully.");
      setFormData({ name: "", description: "", price_per_day: "", location: "" });
      await fetchMachinery();
    } catch (err) {
      console.error("Error adding machinery:", err);
      alert(err.response?.data?.error || "Unable to add machinery.");
    } finally {
      setSaving(false);
    }
  };

  const total = machinery.length;
  const available = machinery.filter((item) => item.available).length;
  const inUse = total - available;

  return (
    <div className="dashboard-page-container">
      <h1>Your Machinery</h1>
      <p>Farmer ID: {farmerId || "Not logged in"}</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Equipment</h3>
          <div className="value">{total}</div>
        </div>
        <div className="info-card">
          <h3>Available</h3>
          <div className="value">{available}</div>
        </div>
        <div className="info-card">
          <h3>In Use</h3>
          <div className="value">{inUse}</div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Add Machinery</h2>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Equipment Name:</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="price_per_day">Price Per Day (₹):</label>
        <input
          id="price_per_day"
          name="price_per_day"
          type="number"
          min="0"
          value={formData.price_per_day}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location:</label>
        <input id="location" name="location" value={formData.location} onChange={handleChange} />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Machinery"}
        </button>
      </form>

      <h2>Your Equipment List</h2>
      {loading ? (
        <p>Loading machinery...</p>
      ) : machinery.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Price/Day</th>
                <th>Location</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {machinery.map((item) => (
                <tr key={item.machinery_id}>
                  <td>{item.name}</td>
                  <td>₹{Number(item.price_per_day).toLocaleString()}</td>
                  <td>{item.location || "-"}</td>
                  <td>{item.available ? "Available" : "In Use"}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No machinery listed yet.</p>
        </div>
      )}
    </div>
  );
}
