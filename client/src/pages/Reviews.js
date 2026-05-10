import React from "react";
import "../stylesheets/dashboard-pages.css";

export default function Reviews() {
  return (
    <div className="dashboard-page-container">
      <h1>Reviews & Ratings</h1>
      <p>
        Farmer ID (Email):{" "}
        <strong>{localStorage.getItem("userEmail") || "farmerId"}</strong>
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Average Rating</h3>
          <div className="value">4.6</div>
        </div>
        <div className="info-card">
          <h3>Total Reviews</h3>
          <div className="value">28</div>
        </div>
        <div className="info-card">
          <h3>Recent (30 days)</h3>
          <div className="value">7</div>
        </div>
      </div>

      <h2>Customer Reviews</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Equipment</th>
            <th>Rating</th>
            <th>Date</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ram Kumar</td>
            <td>Tractor</td>
            <td>★★★★★</td>
            <td>2024-03-15</td>
            <td>Excellent service and equipment</td>
          </tr>
          <tr>
            <td>Priya Sharma</td>
            <td>Harvester</td>
            <td>★★★★☆</td>
            <td>2024-03-12</td>
            <td>Good condition, timely delivery</td>
          </tr>
          <tr>
            <td>Vikram Singh</td>
            <td>Plow</td>
            <td>★★★★★</td>
            <td>2024-03-10</td>
            <td>Perfect for our farm needs</td>
          </tr>
        </tbody>
      </table>

      <h2>Add Public Response</h2>
      <form className="dashboard-form">
        <label htmlFor="response">Reply to Reviews (Optional):</label>
        <textarea
          id="response"
          name="response"
          placeholder="Write your response to customer reviews or add any public message..."
          rows="4"
        ></textarea>
        <button type="submit">Post Response</button>
      </form>
    </div>
  );
}
