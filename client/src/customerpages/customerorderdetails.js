import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Customerorderdetails() {
  const customerId = sessionStorage.getItem("userEmail");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId) {
        setError("Customer email is missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await api.get(
          `/customerdashboard/orders?customer_id=${encodeURIComponent(customerId)}`
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.error || "Unable to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.price) * Number(order.quantity),
    0
  );

  return (
    <div className="dashboard-page-container">
      <h1>Your Order Details</h1>
      <p>Customer ID: {customerId || "Not logged in"}</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Orders</h3>
          <div className="value">{new Set(orders.map((o) => o.order_id)).size}</div>
        </div>
        <div className="info-card">
          <h3>Pending Items</h3>
          <div className="value">
            {orders.filter((o) => o.status !== "Delivered").length}
          </div>
        </div>
        <div className="info-card">
          <h3>Total Spent</h3>
          <div className="value">₹{totalSpent.toLocaleString()}</div>
        </div>
      </div>

      <h2>Order History</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && orders.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={`${order.order_id}-${order.product_id}-${index}`}>
                  <td>#{order.order_id}</td>
                  <td>{order.product_name}</td>
                  <td>{order.quantity}</td>
                  <td>₹{Number(order.price).toLocaleString()}</td>
                  <td>{order.order_date}</td>
                  <td>{order.delivery_date || "-"}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && orders.length === 0 && !error && (
        <div className="empty-state">
          <p>No orders found. Start shopping!</p>
        </div>
      )}
    </div>
  );
}
