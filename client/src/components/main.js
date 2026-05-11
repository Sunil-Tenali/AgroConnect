import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

/**
 * Main Landing Page Component
 * Displays welcome message and role-based login/signup options for farmers and customers
 */
export default function Main() {
  const [isNavbarActive, setIsNavbarActive] = useState(false);

  // Sticky navbar: activate when user scrolls past hero section
  useEffect(() => {
    const handleScroll = () => {
      const navbarEl = document.querySelector(".navbar");
      const bottomContainerEl = document.querySelector(".bottom-container");

      if (
        window.scrollY >
        bottomContainerEl.offsetTop - navbarEl.offsetHeight
      ) {
        setIsNavbarActive(true);
      } else {
        setIsNavbarActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar isNavbarActive={isNavbarActive} />
      <Header />
      <LoginCredentials />
    </>
  );
}

/**
 * Navigation Bar Component
 * Simple navbar with platform branding and navigation placeholders
 */
function Navbar({ isNavbarActive }) {
  return (
    <div className={isNavbarActive ? "navbar active" : "navbar"}>
      <ul className="navbarmain">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#about">About Us</a>
        </li>
        <li>
          <a href="#help">Help</a>
        </li>
        <li>
          <a href="#news">News</a>
        </li>
      </ul>
    </div>
  );
}

/**
 * Hero Header Component
 * Displays main banner image and platform tagline
 */
function Header() {
  return (
    <div>
      <div className="bottom-container"></div>
      <img
        src="images/agro5.jpg"
        alt="AgroConnect - Connecting Farmers and Customers"
        className="agromain"
      />
      <h1 className="overimage">AGRO CONNECT</h1>
      <p className="overh1">
        "Connecting Farmers and Customers: AgroConnect - Grow Together, Harvest
        Together."
      </p>
    </div>
  );
}

/**
 * Login Selection Component
 * Provides quick-access buttons for farmers and customers to login or signup
 */
function LoginCredentials() {
  return (
    <>
      <div className="twologins">
        {/* Farmer section */}
        <div className="farmerlogin">
          <h1>For Farmers</h1>
          <p className="p1 two-line-text">
            Welcome to AgroConnect, the premier platform for farmers
            <span className="middle-line"> to connect and thrive.</span>
          </p>

          <Link to="/farmerLogin" className="custom-button">
            Login
          </Link>
          <p>New to AgroConnect?</p>
          <p>
            Reach out to our team or{" "}
            <Link to="/farmerSignup" className="custom-button">
              Get started now
            </Link>{" "}
          </p>
        </div>

        {/* Customer section */}
        <div className="customerlogin">
          <h1>For Customers</h1>
          <p className="p2 two-line-text">
            Join millions on AgroConnect. Discover fresh produce and
            <span className="middle-line"> enjoy farm-to-table goodness.</span>
          </p>

          <Link to="/customerLogin" className="custom-button">
            Login
          </Link>
          <p>New to AgroConnect?</p>
          <p>
            Embark on a fresh journey{" "}
            <Link to="/customerSignup" className="custom-button">
              Get started now.
            </Link>
          </p>
        </div>
      </div>
      <div className="footer">
        &copy; 2024 AgroConnect, Inc. | All Rights Reserved
      </div>
    </>
  );
}
