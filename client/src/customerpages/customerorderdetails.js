import React, { useState, useEffect } from "react";
import "../stylesheets/dashboard-pages.css";
import axios from "axios";

export default function Customerorderdetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from backend when component mounts
    const fetchOrders = async () => {
      try {
        const customerId = localStorage.getItem("userEmail");
        // Assuming there's an endpoint to fetch customer orders
        // const response = await axios.get(`http://localhost:4000/customerdashboard/orders?customer_id=${customerId}`);
        // setOrders(response.data);
        
        // Mock data for now (replace with actual API call)
        setOrders([
          {
            order_id: 1001,
            product_name: "Organic Tomatoes",
            quantity: 10,
            price: 250,
            order_date: "2024-03-10",
            status: "Delivered",
          },
          {
            order_id: 1002,
            product_name: "Fresh Apples",
            quantity: 5,
            price: 500,
            order_date: "2024-03-12",
            status: "In Transit",
          },
          {
            order_id: 1003,
            product_name: "Dairy Milk",
            quantity: 20,
            price: 100,
            order_date: "2024-03-15",
            status: "Processing",
          },
        ]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="dashboard-page-container">
      <h1>Your Order Details</h1>
      <p>
        Customer ID:{" "}
        <strong>{localStorage.getItem("userEmail") || "customerId"}</strong>
      </p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Orders</h3>
          <div className="value">{orders.length}</div>
        </div>
        <div className="info-card">
          <h3>Pending Orders</h3>
          <div className="value">
            {orders.filter((o) => o.status !== "Delivered").length}
          </div>
        </div>
        <div className="info-card">
          <h3>Total Spent</h3>
          <div className="value">
            ₹
            {orders
              .reduce((sum, order) => sum + order.price * order.quantity, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      <h2>Order History</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>{order.product_name}</td>
                <td>{order.quantity} units</td>
                <td>₹{order.price}</td>
                <td>{order.order_date}</td>
                <td
                  style={{
                    fontWeight: "600",
                    color:
                      order.status === "Delivered"
                        ? "#64ba00"
                        : order.status === "In Transit"
                        ? "#ff9800"
                        : "#2196f3",
                  }}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
          No orders found. Start shopping!
        </p>
      )}
    </div>
  );
}
