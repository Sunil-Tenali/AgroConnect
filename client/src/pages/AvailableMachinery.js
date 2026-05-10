import React from "react";
import "../stylesheets/dashboard-pages.css";

export default function AvailableMachinery() {
  return (
    <div className="dashboard-page-container">
      <h1>Available Machinery</h1>
      <p>Browse and manage machinery available for rent in your area.</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Available</h3>
          <div className="value">24</div>
        </div>
        <div className="info-card">
          <h3>Nearby Farmers</h3>
          <div className="value">12</div>
        </div>
        <div className="info-card">
          <h3>Avg. Price/Day</h3>
          <div className="value">₹500</div>
        </div>
      </div>

      <h2>Available Equipment Catalog</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Owner</th>
            <th>Price/Day</th>
            <th>Location</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tractor 50HP</td>
            <td>Rajesh Kumar</td>
            <td>₹600</td>
            <td>District: Pune</td>
            <td>★★★★★</td>
          </tr>
          <tr>
            <td>Combine Harvester</td>
            <td>Priya Singh</td>
            <td>₹1200</td>
            <td>District: Nashik</td>
            <td>★★★★☆</td>
          </tr>
          <tr>
            <td>Irrigation Pump</td>
            <td>Vikram Patil</td>
            <td>₹300</td>
            <td>District: Aurangabad</td>
            <td>★★★★★</td>
          </tr>
          <tr>
            <td>Thresher</td>
            <td>Sunita Dubey</td>
            <td>₹400</td>
            <td>District: Solapur</td>
            <td>★★★☆☆</td>
          </tr>
        </tbody>
      </table>

      <h2>Find Equipment by Filter</h2>
      <form className="dashboard-form">
        <div className="form-row">
          <div>
            <label htmlFor="equipment-type">Equipment Type:</label>
            <select id="equipment-type" name="equipment-type">
              <option value="">Select a type...</option>
              <option value="tractor">Tractor</option>
              <option value="harvester">Harvester</option>
              <option value="pump">Irrigation Pump</option>
            </select>
          </div>
          <div>
            <label htmlFor="location">Location/District:</label>
            <input
              type="text"
              id="location"
              placeholder="Enter district name..."
            />
          </div>
        </div>
        <button type="submit">Search Equipment</button>
      </form>
    </div>
  );
}
