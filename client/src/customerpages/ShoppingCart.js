import React, { useState } from "react";
import "../stylesheets/dashboard-pages.css";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      product_name: "Organic Tomatoes",
      quantity: 5,
      price: 250,
      farmer: "Rajesh Kumar",
    },
    {
      id: 2,
      product_name: "Fresh Apples",
      quantity: 3,
      price: 500,
      farmer: "Priya Singh",
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="dashboard-page-container">
      <h1>Shopping Cart</h1>
      <p>
        Review and manage your items before checkout
      </p>

      {cartItems.length > 0 ? (
        <>
          <div className="dashboard-info-grid">
            <div className="info-card">
              <h3>Total Items</h3>
              <div className="value">{cartItems.length}</div>
            </div>
            <div className="info-card">
              <h3>Total Quantity</h3>
              <div className="value">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </div>
            <div className="info-card">
              <h3>Total Price</h3>
              <div className="value">₹{totalPrice.toLocaleString()}</div>
            </div>
          </div>

          <h2>Cart Items</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Farmer</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.farmer}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      style={{
                        width: "50px",
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                  <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(item.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ff6b6b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              textAlign: "right",
            }}
          >
            <h3>Order Summary</h3>
            <p>
              <strong>Subtotal:</strong> ₹{totalPrice.toLocaleString()}
            </p>
            <p>
              <strong>Shipping:</strong> ₹50
            </p>
            <h2 style={{ color: "#64ba00" }}>
              <strong>Total: ₹{(totalPrice + 50).toLocaleString()}</strong>
            </h2>
            <button
              style={{
                marginTop: "15px",
                padding: "12px 30px",
                backgroundColor: "#64ba00",
                color: "white",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
          Your cart is empty. Start adding items!
        </p>
      )}
    </div>
  );
}
