import React, { useState, useEffect } from "react";
import Navbar from "../pages/Navbar.js";
import "../stylesheets/dashboard-pages.css";
import axios from "axios";

export default function Customercontactdetails() {
  const [contactdet, setContactdet] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const user_id = localStorage.getItem("userEmail");
    if (user_id) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user_id,
      }));
    }
  }, []);

  const fetchData = async () => {
    try {
      const user_id = localStorage.getItem("userEmail");
      const response = await axios.get(
        `http://localhost:4000/customerdashboard/customercontact?user_id=${user_id}`
      );
      console.log(response);
      localStorage.setItem("addressid", response.data[1].address_id);
      setContactdet(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [formData, setFormData] = useState({
    user_id: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/customerdashboard/customercontact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("You have successfully updated contact details");
        fetchData();
      } else {
        alert("Oops! Please double-check your information and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="dashboard-page-container">
      <h1>Your Contact Details</h1>

      <h2>Add / Update Address</h2>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label>Street Address 1:</label>
            <input
              type="text"
              name="street1"
              value={formData.street1}
              onChange={handleChange}
              placeholder="Enter primary street address"
              required
            />
          </div>
          <div>
            <label>Street Address 2 (Optional):</label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
              placeholder="Enter secondary street address"
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />
          </div>
          <div>
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              required
            />
          </div>
          <div>
            <label>Zipcode:</label>
            <input
              type="number"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="Enter zipcode"
              required
            />
          </div>
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <button type="submit">Save Details</button>
      </form>

      <h2>Your Previous Addresses</h2>
      {contactdet.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Street 1</th>
              <th>Street 2</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Zipcode</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {contactdet.map((contactd) => (
              <tr key={contactd.address_id}>
                <td>{contactd.street1}</td>
                <td>{contactd.street2}</td>
                <td>{contactd.city}</td>
                <td>{contactd.state}</td>
                <td>{contactd.country}</td>
                <td>{contactd.zipcode}</td>
                <td>{contactd.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#999" }}>No addresses saved yet.</p>
      )}
    </div>
  );
}

