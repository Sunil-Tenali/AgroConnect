import React, { useState, useEffect } from "react";
import "../stylesheets/productHome.css";
import axios from "axios";

export default function Producthome() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const customer_id = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/customerdashboard/productHome"
      );

      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCheckboxChange = (event) => {
    const productId = parseInt(event.target.value);

    if (event.target.checked) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const handleAddToCart = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/customerdashboard/productHome",
        {
          customer_id,
          product_ids: selectedProducts,
        }
      );

      console.log(response);
      alert("Products added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add products to cart.");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/customerdashboard/placeorder",
        { customer_id }
      );

      console.log(response);
      alert("Order placed successfully.");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="pcontainer">
      <h1>Welcome to Agro Connect Customer Home</h1>

      <div className="custprofile">
        <h2>Your Name : Customer Name</h2>
        <h3>Your Email : {customer_id}</h3>
      </div>

      <div className="productslist">
        <h4>Product List :</h4>

        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Farmer ID</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Review Count</th>
              <th>Category ID</th>
              <th>Description</th>
              <th>Available Units</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.farmer_id}</td>
                <td>{product.price}</td>
                <td>{product.rating}</td>
                <td>{product.review_count}</td>
                <td>{product.category_id}</td>
                <td>{product.description}</td>
                <td>{product.available_units}</td>
                <td>{product.in_stock}</td>

                <td>
                  <input
                    type="checkbox"
                    id={`product_${product.product_id}`}
                    name={`product_${product.product_id}`}
                    value={product.product_id}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={`product_${product.product_id}`}></label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="actions">
          <button onClick={handleAddToCart}>Add to Cart</button>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}