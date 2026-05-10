import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
export default function Main() {
  const [isNavbarActive, setIsNavbarActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbarEl = document.querySelector(".navbar");
      const bottomContainerEl = document.querySelector(".bottom-container");

      // Activate sticky navbar when user scrolls past the hero section
      if (
        window.scrollY >
        bottomContainerEl.offsetTop - navbarEl.offsetHeight - 0
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
function Navbar({ isNavbarActive }) {
  return (
    <div className={isNavbarActive ? "navbar active" : "navbar"}>
      <ul className={"navbarmain"}>
        <li>
          <a href="a">Home</a>
        </li>
        <li>
          <a href="p">About Us</a>
        </li>
        <li>
          <a href="e">Help</a>
        </li>
        <li>
          <a href="s">News</a>
        </li>
        <li>
          <a href="s">f2c_user-Signin</a>
        </li>
      </ul>
    </div>
  );
}
function Header() {
  return (
    <div>
      <div className="bottom-container"></div>
      <img
        src={"images/agro5.jpg "}
        alt={"Agro Connect"}
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
function LoginCredentials() {
  return (
    <>
      <div className="twologins">
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
