import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/signup.css";
import Videobg from "../assets/agro7.mp4";

/**
 * Farmer Login Component
 * 
 * Handles farmer authentication by validating credentials against backend.
 * On successful login, stores email in sessionStorage for maintaining user session
 * and redirects to the farmer dashboard.
 * 
 * Authentication Flow:
 * 1. User enters email and password
 * 2. Credentials sent to POST /login endpoint
 * 3. Backend validates credentials and returns user type (1 = farmer)
 * 4. Email stored in sessionStorage for subsequent API calls
 * 5. Redirect to /farmerdashboard/home
 * 
 * Security Note: Current session management uses sessionStorage (non-persistent).
 * For production: Implement JWT tokens or secure HTTP-only cookies.
 */
function Farmerlogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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
        // Store email in sessionStorage for user identification across dashboard
        sessionStorage.setItem("userEmail", formData.email);
        navigate("/farmerdashboard/home");
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
        <p className="pp">to AgroConnect for Farmers</p>

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

        <label htmlFor="passwordfarmer">Your Password</label>
        <br />
        <input
          type="password"
          id="passwordfarmer"
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
        <p className="pp">Need help? Contact support for assistance.</p>
      </form>
    </>
  );
}

export default Farmerlogin;
