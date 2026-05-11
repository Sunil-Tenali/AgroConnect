import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/signup.css";
import Videobg from "../assets/agro9.mp4";

function Customersignup() {
  const navigate = useNavigate();

  const [submitButtonValue, setSubmitButtonValue] = useState("Sign Up ➡️");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    user_type: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitButtonValue("Signing up...");

    try {
      const response = await fetch("http://localhost:4000/customersignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      const userEmail = data.user?.email || formData.email;

      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("userType", "customer");
      sessionStorage.setItem("userName", formData.fname);

      setSubmitButtonValue("Signed up");

      navigate("/customerdashboard/productHome");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Signup failed. Please try again.");
      setSubmitButtonValue("Sign Up ➡️");
    }
  };

  return (
    <>
      <video autoPlay loop muted playsInline className="background-video">
        <source src={Videobg} type="video/mp4" />
      </video>

      <div className="login-page-actions">
        <button type="button" onClick={() => navigate("/")} className="login-nav-btn">
          Home
        </button>

        <button type="button" onClick={handleBack} className="login-nav-btn secondary">
          Back
        </button>
      </div>

      <form className="content" onSubmit={handleSubmit}>
        <h1>Welcome to AgroConnect - Customer Signup</h1>
        <h2>Create Your Account</h2>

        {error && <p className="form-error">{error}</p>}

        <label htmlFor="fname">First Name</label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
          required
        />

        <label htmlFor="lname">Last Name</label>
        <input
          type="text"
          id="lname"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
        />

        <label htmlFor="email">Your Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input type="submit" value={submitButtonValue} />
        <button type="button" onClick={() => navigate("/")} className="login-nav-btn">
          Home
        </button>

        <p>By creating an account, you agree to our Terms & Conditions and Privacy Policy.</p>
        <p>Need help? Contact Us</p>
      </form>
    </>
  );
}

export default Customersignup;
