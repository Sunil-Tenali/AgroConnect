import React, { useState, useEffect } from "react";
import "../stylesheets/dashboard-pages.css";
import axios from "axios";

export default function Products() {
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    price: "",
    description: "",
    available_units: "",
    farmer_id: "",
    carrier_phone: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setFormData((prevData) => ({
        ...prevData,
        farmer_id: userEmail,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let categoryId;

    if (name === "category_id") {
      switch (value) {
        case "Vegetables":
          categoryId = 1;
          break;
        case "Fruits":
          categoryId = 2;
          break;
        case "Dairy Products":
          categoryId = 3;
          break;
        default:
          categoryId = "";
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        category_id: categoryId,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/farmerdashboard/products",
        formData
      );
      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");
      setFormData({
        category_id: "",
        name: "",
        price: "",
        description: "",
        available_units: "",
        farmer_id: formData.farmer_id,
        carrier_phone: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <div className="dashboard-page-container">
      <h1>Add New Product</h1>
      <p>List your agricultural products for sale</p>

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label htmlFor="categoryId">Select Category:</label>
            <select
              id="categoryId"
              name="category_id"
              onChange={handleChange}
              value={formData.category_id}
              required
            >
              <option value="">-- Select a category --</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy Products">Dairy Products</option>
            </select>
          </div>
          <div>
            <label htmlFor="productname">Product Name:</label>
            <input
              type="text"
              id="productname"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="productprice">Price (₹):</label>
            <input
              type="number"
              id="productprice"
              name="price"
              placeholder="Enter product price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="availableunits">Available Units:</label>
            <input
              type="number"
              id="availableunits"
              name="available_units"
              placeholder="Enter quantity available"
              value={formData.available_units}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="description">Product Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your product in detail (quality, use, benefits, etc.)..."
          rows="4"
        ></textarea>

        <div className="form-row">
          <div>
            <label htmlFor="carrierphone">Carrier / Contact Phone:</label>
            <input
              type="tel"
              id="carrierphone"
              name="carrier_phone"
              placeholder="Enter contact phone number"
              value={formData.carrier_phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit">Add Product</button>
      </form>

      <h2>Your Listed Products</h2>
      {products.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available Units</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.available_units}</td>
                <td style={{ color: "#64ba00", fontWeight: "600" }}>Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
          No products listed yet. Add your first product above!
        </p>
      )}
    </div>
  );
}
