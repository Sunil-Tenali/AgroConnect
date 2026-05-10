import React from "react";
import "../stylesheets/dashboard-pages.css";

export default function Home() {
  return (
    <div className="dashboard-page-container">
      <h1>Welcome to Farmer Dashboard</h1>
      <p>
        Farmer ID (Email):{" "}
        <strong>{localStorage.getItem("userEmail") || "farmerId"}</strong>
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Products Listed</h3>
          <div className="value">12</div>
        </div>
        <div className="info-card">
          <h3>Average Rating</h3>
          <div className="value">4.5</div>
        </div>
        <div className="info-card">
          <h3>Total Likes</h3>
          <div className="value">150</div>
        </div>
      </div>

      <h2>Your Performance Summary</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          margin: "20px 0",
        }}
      >
        <div className="info-card">
          <h3>Ratings</h3>
          <div className="value">150</div>
        </div>
        <div className="info-card">
          <h3>Reviews Count</h3>
          <div className="value">28</div>
        </div>
      </div>

      <h2>Farmer Profile Description</h2>
      <form className="dashboard-form">
        <label htmlFor="description">Update Your Description:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Write a compelling description about yourself, your farming practices, and what makes your products unique..."
          rows="5"
        ></textarea>
        <button type="submit">Update Description</button>
      </form>

      <h2>Quick Links</h2>
      <ul className="item-list">
        <li>
          <strong>📦 Add New Product:</strong> List your agricultural products for
          sale
        </li>
        <li>
          <strong>🚜 Manage Machinery:</strong> Add or update your available
          equipment
        </li>
        <li>
          <strong>📞 Contact Details:</strong> Keep your information updated
        </li>
        <li>
          <strong>⭐ View Reviews:</strong> See what customers say about you
        </li>
      </ul>
    </div>
  );
}
