import React from "react";
import "../stylesheets/dashboard-pages.css";

export default function Rented() {
  return (
    <div className="dashboard-page-container">
      <h1>Rented Machinery</h1>
      <p>
        Farmer ID (Email):{" "}
        <strong>{localStorage.getItem("userEmail") || "farmerId"}</strong>
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Average Rating</h3>
          <div className="value">4.5</div>
        </div>
        <div className="info-card">
          <h3>Total Rents</h3>
          <div className="value">12</div>
        </div>
        <div className="info-card">
          <h3>Active Rentals</h3>
          <div className="value">3</div>
        </div>
      </div>

      <h2>Your Rented Items</h2>
      <p>View and manage your currently rented machinery below.</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Rental Date</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tractor</td>
            <td>2024-03-01</td>
            <td>2024-03-15</td>
            <td style={{ color: "#64ba00", fontWeight: "600" }}>Active</td>
          </tr>
          <tr>
            <td>Harvester</td>
            <td>2024-02-20</td>
            <td>2024-03-10</td>
            <td style={{ color: "#64ba00", fontWeight: "600" }}>Active</td>
          </tr>
        </tbody>
      </table>

      <h2>Update Description</h2>
      <form className="dashboard-form">
        <label htmlFor="description">Rental Notes / Description:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Write any notes or description about your rental experience..."
          rows="5"
        ></textarea>
        <button type="submit">Save Description</button>
      </form>
    </div>
  );
}
