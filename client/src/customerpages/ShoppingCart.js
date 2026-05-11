import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function ShoppingCart() {
  const customerId = sessionStorage.getItem("userEmail");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    if (!customerId) {
      setError("Customer email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/customerdashboard/cart?customer_id=${encodeURIComponent(customerId)}`
      );
      setCartItems(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.error || "Unable to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleRemove = async (productId) => {
    try {
      setSaving(true);
      const response = await api.delete(
        `/customerdashboard/cart/${productId}?customer_id=${encodeURIComponent(customerId)}`
      );
      setCartItems(response.data.cart);
    } catch (err) {
      console.error("Error removing cart item:", err);
      alert(err.response?.data?.error || "Unable to remove item.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const quantity = Number(newQuantity);

    if (Number.isNaN(quantity) || quantity < 1) {
      return;
    }

    try {
      setSaving(true);
      const response = await api.patch(`/customerdashboard/cart/${productId}`, {
        customer_id: customerId,
        quantity,
      });
      setCartItems(response.data.cart);
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert(err.response?.data?.error || "Unable to update quantity.");
      await fetchCart();
    } finally {
      setSaving(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setSaving(true);
      await api.post("/customerdashboard/placeorder", {
        customer_id: customerId,
      });
      alert("Order placed successfully.");
      await fetchCart();
    } catch (err) {
      console.error("Error placing order:", err);
      alert(
        err.response?.data?.error ||
          "Failed to place order. Save your contact address before checkout."
      );
    } finally {
      setSaving(false);
    }
  };

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0
  );
  const shipping = cartItems.length > 0 ? 50 : 0;

  return (
    <div className="dashboard-page-container">
      <h1>Shopping Cart</h1>
      <p>Review and manage your items before checkout.</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Items</h3>
          <div className="value">{cartItems.length}</div>
        </div>
        <div className="info-card">
          <h3>Total Quantity</h3>
          <div className="value">{totalQuantity}</div>
        </div>
        <div className="info-card">
          <h3>Subtotal</h3>
          <div className="value">₹{subtotal.toLocaleString()}</div>
        </div>
      </div>

      {loading && <p>Loading cart...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && cartItems.length > 0 ? (
        <>
          <h2>Cart Items</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Farmer</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name}</td>
                    <td>{item.farmer_name || item.farmer_id}</td>
                    <td>₹{Number(item.price).toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={item.available_units}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.product_id, e.target.value)
                        }
                        disabled={saving}
                        style={{ width: "70px", padding: "6px" }}
                      />
                    </td>
                    <td>₹{Number(item.subtotal).toLocaleString()}</td>
                    <td>{item.available_units}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.product_id)}
                        disabled={saving}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Order Summary</h2>
          <p>Subtotal: ₹{subtotal.toLocaleString()}</p>
          <p>Shipping: ₹{shipping.toLocaleString()}</p>
          <h2>Total: ₹{(subtotal + shipping).toLocaleString()}</h2>
          <button type="button" onClick={handlePlaceOrder} disabled={saving}>
            {saving ? "Processing..." : "Proceed to Checkout"}
          </button>
        </>
      ) : null}

      {!loading && cartItems.length === 0 && !error && (
        <div className="empty-state">
          <p>Your cart is empty. Start adding items!</p>
        </div>
      )}
    </div>
  );
}
