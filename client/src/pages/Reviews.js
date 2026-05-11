import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Reviews() {
  const farmerId = sessionStorage.getItem("userEmail");

  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!farmerId) {
        setError("Farmer email is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [summaryResponse, reviewsResponse] = await Promise.all([
          api.get(`/farmerdashboard/summary?farmer_id=${encodeURIComponent(farmerId)}`),
          api.get(`/farmerdashboard/reviews?farmer_id=${encodeURIComponent(farmerId)}`),
        ]);
        setSummary(summaryResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.response?.data?.error || "Unable to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [farmerId]);

  const renderStars = (rating) => {
    const value = Math.round(Number(rating));
    return "★".repeat(value) + "☆".repeat(5 - value);
  };

  const recentCount = reviews.filter(
    (review) =>
      new Date(review.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="dashboard-page-container">
      <h1>Reviews & Ratings</h1>
      <p>Farmer ID: {farmerId || "Not logged in"}</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Average Rating</h3>
          <div className="value">
            {summary ? Number(summary.average_rating).toFixed(1) : "0.0"}
          </div>
        </div>
        <div className="info-card">
          <h3>Total Reviews</h3>
          <div className="value">{reviews.length}</div>
        </div>
        <div className="info-card">
          <h3>Recent 30 Days</h3>
          <div className="value">{recentCount}</div>
        </div>
      </div>

      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Customer Reviews</h2>
      {!loading && reviews.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Date</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.review_id}>
                  <td>{review.customer_name}</td>
                  <td>{review.product_name}</td>
                  <td>{renderStars(review.rating)}</td>
                  <td>{review.date}</td>
                  <td>{review.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && reviews.length === 0 && !error && (
        <div className="empty-state">
          <p>No reviews yet.</p>
        </div>
      )}
    </div>
  );
}
