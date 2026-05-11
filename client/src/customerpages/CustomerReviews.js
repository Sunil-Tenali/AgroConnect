import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function CustomerReviews() {
  const customerId = sessionStorage.getItem("userEmail");

  const [reviews, setReviews] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [newReview, setNewReview] = useState({
    product_id: "",
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!customerId) {
      setError("Customer email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [reviewsResponse, productsResponse] = await Promise.all([
        api.get(`/customerdashboard/reviews?customer_id=${encodeURIComponent(customerId)}`),
        api.get(
          `/customerdashboard/purchased-products?customer_id=${encodeURIComponent(customerId)}`
        ),
      ]);
      setReviews(reviewsResponse.data);
      setPurchasedProducts(productsResponse.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.error || "Unable to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.product_id || !newReview.comment) {
      alert("Please select a product and enter your review.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/customerdashboard/reviews", {
        customer_id: customerId,
        product_id: Number(newReview.product_id),
        rating: Number(newReview.rating),
        comment: newReview.comment,
      });

      alert("Review submitted successfully!");
      setNewReview({ product_id: "", rating: 5, comment: "" });
      await fetchData();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.error || "Failed to submit review.");
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating) => {
    const value = Math.round(Number(rating));
    return "★".repeat(value) + "☆".repeat(5 - value);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const recentCount = reviews.filter(
    (review) =>
      new Date(review.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="dashboard-page-container">
      <h1>My Reviews & Ratings</h1>
      <p>Share your experience with products and farmers.</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Reviews</h3>
          <div className="value">{reviews.length}</div>
        </div>
        <div className="info-card">
          <h3>Average Rating</h3>
          <div className="value">{averageRating}</div>
        </div>
        <div className="info-card">
          <h3>Recent 30 Days</h3>
          <div className="value">{recentCount}</div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Write a Review</h2>
      <form className="dashboard-form" onSubmit={handleSubmitReview}>
        <label htmlFor="product_id">Purchased Product:</label>
        <select
          id="product_id"
          name="product_id"
          value={newReview.product_id}
          onChange={handleReviewChange}
          required
        >
          <option value="">-- Select a purchased product --</option>
          {purchasedProducts.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.product_name} by {product.farmer_name}
            </option>
          ))}
        </select>

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

        <label htmlFor="comment">Your Review:</label>
        <textarea
          id="comment"
          name="comment"
          value={newReview.comment}
          onChange={handleReviewChange}
          required
        />

        <button type="submit" disabled={saving || purchasedProducts.length === 0}>
          {saving ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <h2>Your Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <ul className="item-list">
          {reviews.map((review) => (
            <li key={review.review_id}>
              <h3>{review.product_name}</h3>
              <p>by {review.farmer_name}</p>
              <p style={{ color: "#f4a100", fontSize: "20px" }}>
                {renderStars(review.rating)}
              </p>
              <p>{review.comment}</p>
              <small>{review.date}</small>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No reviews yet. Purchase a product and start reviewing!</p>
        </div>
      )}
    </div>
  );
}
