import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Products() {
  const farmerId = sessionStorage.getItem("userEmail");

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    price: "",
    description: "",
    available_units: "",
    farmer_id: farmerId || "",
    carrier_phone: "",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!farmerId) {
      setError("Farmer email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [productResponse, categoryResponse, carrierResponse] = await Promise.all([
        api.get(`/farmerdashboard/products?farmer_id=${encodeURIComponent(farmerId)}`),
        api.get("/categories"),
        api.get("/carriers"),
      ]);

      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
      setCarriers(carrierResponse.data);
    } catch (err) {
      console.error("Error loading product page data:", err);
      setError(err.response?.data?.error || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, farmer_id: farmerId || "" }));
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      alert("Please login again. Farmer email is missing.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/farmerdashboard/products", {
        ...formData,
        farmer_id: farmerId,
        price: Number(formData.price),
        category_id: Number(formData.category_id),
        available_units: Number(formData.available_units),
      });

      alert("Product added successfully!");
      setFormData({
        category_id: "",
        name: "",
        price: "",
        description: "",
        available_units: "",
        farmer_id: farmerId,
        carrier_phone: "",
      });
      await fetchData();
    } catch (err) {
      console.error("Error adding product:", err);
      alert(err.response?.data?.error || "Error adding product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page-container">
      <h1>Add New Product</h1>
      <p>List your agricultural products for sale.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label htmlFor="category_id">Select Category:</label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a category --</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>

        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <div>
            <label htmlFor="price">Price (₹):</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="available_units">Available Units:</label>
            <input
              type="number"
              id="available_units"
              name="available_units"
              min="0"
              value={formData.available_units}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="carrier_phone">Carrier / Contact Phone:</label>
        <select
          id="carrier_phone"
          name="carrier_phone"
          value={formData.carrier_phone}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a carrier --</option>
          {carriers.map((carrier) => (
            <option key={carrier.carrier_id} value={carrier.carrier_phone}>
              {carrier.carrier_name} - {carrier.carrier_phone}
            </option>
          ))}
        </select>

        <label htmlFor="description">Product Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add Product"}
        </button>
      </form>

      <h2>Your Listed Products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available Units</th>
                <th>Rating</th>
                <th>Carrier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.name}</td>
                  <td>{product.category_name}</td>
                  <td>₹{Number(product.price).toLocaleString()}</td>
                  <td>{product.available_units}</td>
                  <td>
                    {Number(product.rating).toFixed(1)} ({product.review_count})
                  </td>
                  <td>{product.carrier_name || product.carrier_phone || "-"}</td>
                  <td>{product.in_stock ? "Active" : "Out of stock"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No products listed yet. Add your first product above!</p>
        </div>
      )}
    </div>
  );
}
