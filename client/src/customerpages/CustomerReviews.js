import React, { useState } from "react";
import "../stylesheets/dashboard-pages.css";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([
    {
      review_id: 1,
      product_name: "Organic Tomatoes",
      farmer_name: "Rajesh Kumar",
      rating: 5,
      comment: "Fresh and high quality vegetables. Highly recommended!",
      date: "2024-03-15",
    },
    {
      review_id: 2,
      product_name: "Fresh Apples",
      farmer_name: "Priya Singh",
      rating: 4,
      comment: "Good quality but slightly damaged during delivery.",
      date: "2024-03-12",
    },
  ]);

  const [newReview, setNewReview] = useState({
    product_name: "",
    rating: 5,
    comment: "",
  });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReview = () => {
    if (newReview.product_name && newReview.comment) {
      const review = {
        review_id: reviews.length + 1,
        product_name: newReview.product_name,
        farmer_name: "Current Farmer",
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
      };
      setReviews([review, ...reviews]);
      setNewReview({
        product_name: "",
        rating: 5,
        comment: "",
      });
      alert("Review submitted successfully!");
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="dashboard-page-container">
      <h1>My Reviews & Ratings</h1>
      <p>Share your experience with products and farmers</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Reviews</h3>
          <div className="value">{reviews.length}</div>
        </div>
        <div className="info-card">
          <h3>Average Rating</h3>
          <div className="value">
            {(
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)}
          </div>
        </div>
        <div className="info-card">
          <h3>Recent (30 days)</h3>
          <div className="value">
            {reviews.filter(
              (r) =>
                new Date(r.date) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length}
          </div>
        </div>
      </div>

      <h2>Write a Review</h2>
      <form className="dashboard-form">
        <div className="form-row">
          <div>
            <label htmlFor="product">Product Name:</label>
            <input
              type="text"
              id="product"
              name="product_name"
              placeholder="Enter product name"
              value={newReview.product_name}
              onChange={handleReviewChange}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              name="rating"
              value={newReview.rating}
              onChange={handleReviewChange}
            >
              <option value="5">★★★★★ Excellent</option>
              <option value="4">★★★★☆ Good</option>
              <option value="3">★★★☆☆ Average</option>
              <option value="2">★★☆☆☆ Poor</option>
              <option value="1">★☆☆☆☆ Very Poor</option>
            </select>
          </div>
        </div>

        <label htmlFor="comment">Your Review:</label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Share your experience with this product..."
          value={newReview.comment}
          onChange={handleReviewChange}
          rows="4"
        ></textarea>

        <button type="button" onClick={handleSubmitReview}>
          Submit Review
        </button>
      </form>

      <h2>Your Reviews</h2>
      {reviews.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          {reviews.map((review) => (
            <div
              key={review.review_id}
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                borderLeft: "4px solid #64ba00",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>
                    {review.product_name}
                  </h3>
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                    by {review.farmer_name}
                  </p>
                </div>
                <span style={{ color: "#ff9800", fontWeight: "bold" }}>
                  {renderStars(review.rating)}
                </span>
              </div>
              <p style={{ margin: "10px 0", color: "#555" }}>
                {review.comment}
              </p>
              <p
                style={{
                  margin: "5px 0 0 0",
                  color: "#999",
                  fontSize: "12px",
                }}
              >
                {review.date}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
          No reviews yet. Start reviewing products!
        </p>
      )}
    </div>
  );
}
