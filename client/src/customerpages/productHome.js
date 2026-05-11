import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Producthome() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const customerId = sessionStorage.getItem("userEmail");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/customerdashboard/productHome");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.error || "Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCheckboxChange = (event) => {
    const productId = Number(event.target.value);

    if (event.target.checked) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const handleAddToCart = async () => {
    if (!customerId) {
      alert("Please login again. Customer email is missing.");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/customerdashboard/productHome", {
        customer_id: customerId,
        product_ids: selectedProducts,
      });
      alert("Products added to cart successfully.");
      setSelectedProducts([]);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.error || "Failed to add products to cart.");
    } finally {
      setSaving(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customerId) {
      alert("Please login again. Customer email is missing.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/customerdashboard/placeorder", {
        customer_id: customerId,
      });
      alert("Order placed successfully.");
      await fetchProducts();
    } catch (err) {
      console.error("Error placing order:", err);
      alert(
        err.response?.data?.error ||
          "Failed to place order. Add items to cart and save your contact address first."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page-container">
      <h1>Agro Connect Customer Home</h1>
      <p>Browse fresh products from farmers and add them to your cart.</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Customer Email</h3>
          <div className="value" style={{ fontSize: "16px" }}>
            {customerId || "Not logged in"}
          </div>
        </div>
        <div className="info-card">
          <h3>Available Products</h3>
          <div className="value">{products.length}</div>
        </div>
        <div className="info-card">
          <h3>Selected</h3>
          <div className="value">{selectedProducts.length}</div>
        </div>
      </div>

      <h2>Product List</h2>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <p>No products are available right now.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Product</th>
                <th>Farmer</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Available Units</th>
                <th>Carrier</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>
                    <input
                      type="checkbox"
                      id={`product_${product.product_id}`}
                      value={product.product_id}
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={handleCheckboxChange}
                      disabled={!product.in_stock || product.available_units <= 0}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.farmer_name || product.farmer_id}</td>
                  <td>{product.category_name}</td>
                  <td>₹{Number(product.price).toLocaleString()}</td>
                  <td>
                    {Number(product.rating).toFixed(1)} ({product.review_count})
                  </td>
                  <td>{product.available_units}</td>
                  <td>{product.carrier_name || product.carrier_phone || "-"}</td>
                  <td>{product.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button onClick={handleAddToCart} disabled={saving}>
          {saving ? "Please wait..." : "Add to Cart"}
        </button>
        <button onClick={handlePlaceOrder} disabled={saving}>
          Place Order From Cart
        </button>
      </div>
    </div>
  );
}
