import React from "react";
import "../stylesheets/dashboard-pages.css";

export default function Machinery() {
  return (
    <div className="dashboard-page-container">
      <h1>Your Machinery</h1>
      <p>
        Farmer ID (Email):{" "}
        <strong>{localStorage.getItem("userEmail") || "farmerId"}</strong>
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Equipment</h3>
          <div className="value">8</div>
        </div>
        <div className="info-card">
          <h3>Available</h3>
          <div className="value">5</div>
        </div>
        <div className="info-card">
          <h3>In Use</h3>
          <div className="value">3</div>
        </div>
      </div>

      <h2>Your Equipment List</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tractor Model X</td>
            <td>Heavy Equipment</td>
            <td style={{ color: "#64ba00", fontWeight: "600" }}>Available</td>
            <td>2022-01-15</td>
          </tr>
          <tr>
            <td>Harvester 2000</td>
            <td>Harvesting</td>
            <td style={{ color: "#64ba00", fontWeight: "600" }}>Available</td>
            <td>2021-06-20</td>
          </tr>
          <tr>
            <td>Plow Set</td>
            <td>Soil Preparation</td>
            <td style={{ color: "#ff9800", fontWeight: "600" }}>In Use</td>
            <td>2020-03-10</td>
          </tr>
        </tbody>
      </table>

      <h2>Maintenance Notes</h2>
      <form className="dashboard-form">
        <label htmlFor="description">Add Maintenance Notes:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Record maintenance schedules, repairs, or other important notes..."
          rows="5"
        ></textarea>
        <button type="submit">Save Notes</button>
      </form>
    </div>
  );
}
