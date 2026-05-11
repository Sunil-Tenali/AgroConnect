import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/signup.css";
import Videobg from "../assets/agro9.mp4";

/**
 * Customer Login Component
 * Authentication form for customers to access their dashboard
 * Stores email in sessionStorage and redirects to dashboard on successful login
 */
function Customerlogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Update form state as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit login credentials to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Store user email for session tracking
        sessionStorage.setItem("userEmail", formData.email);
        navigate("/customerdashboard/productHome");
      } else {
        alert("Invalid email or password. Please try again.");
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <>
      <div className="mainn">
        <div className="overlay"></div>
        <video src={Videobg} autoPlay loop muted />
      </div>
      <form className="content">
        <h1>Login</h1>
        <p className="pp">to AgroConnect for Customers</p>

        <label htmlFor="emaillogin">Your Email</label>
        <br />
        <input
          type="email"
          id="emaillogin"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
        />
        <br />

        <label htmlFor="passwordcustomer">Your Password</label>
        <br />
        <input
          type="password"
          id="passwordcustomer"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
        <br />

        <input type="submit" onClick={handleSubmit} value="Login ➡️" />
        <button type="button" onClick={() => navigate("/")} className="login-nav-btn">
          Home
        </button>
        <p className="pp">Need help? Contact us for support.</p>
      </form>
    </>
  );
}

export default Customerlogin;
