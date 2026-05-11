import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Customercontactdetails() {
  const userId = sessionStorage.getItem("userEmail");

  const [contactdet, setContactdet] = useState([]);
  const [formData, setFormData] = useState({
    user_id: userId || "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    country: "India",
    zipcode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!userId) {
      setError("User email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/customerdashboard/customercontact?user_id=${encodeURIComponent(userId)}`
      );
      setContactdet(response.data);

      if (response.data.length > 0) {
        sessionStorage.setItem("addressid", response.data[0].address_id);
      }
    } catch (err) {
      console.error("Error fetching contact details:", err);
      setError(err.response?.data?.error || "Unable to fetch contact details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, user_id: userId || "" }));
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.post("/customerdashboard/customercontact", formData);
      alert("Contact details saved successfully.");
      setFormData({
        user_id: userId || "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        country: "India",
        zipcode: "",
        phone: "",
      });
      await fetchData();
    } catch (err) {
      console.error("Error saving contact details:", err);
      alert(err.response?.data?.error || "Failed to save contact details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page-container">
      <h1>Your Contact Details</h1>
      <p>Save your delivery address before placing an order.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label htmlFor="street1">Street Address 1:</label>
        <input
          type="text"
          id="street1"
          name="street1"
          value={formData.street1}
          onChange={handleChange}
          required
        />

        <label htmlFor="street2">Street Address 2:</label>
        <input
          type="text"
          id="street2"
          name="street2"
          value={formData.street2}
          onChange={handleChange}
        />

        <div className="form-row">
          <div>
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="zipcode">Zipcode:</label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Details"}
        </button>
      </form>

      <h2>Your Saved Addresses</h2>
      {loading ? (
        <p>Loading contact details...</p>
      ) : contactdet.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Default</th>
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
              {contactdet.map((contact) => (
                <tr key={contact.address_id}>
                  <td>{contact.is_default ? "Yes" : "No"}</td>
                  <td>{contact.street1}</td>
                  <td>{contact.street2 || "-"}</td>
                  <td>{contact.city}</td>
                  <td>{contact.state}</td>
                  <td>{contact.country}</td>
                  <td>{contact.zipcode}</td>
                  <td>{contact.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No addresses saved yet.</p>
        </div>
      )}
    </div>
  );
}
