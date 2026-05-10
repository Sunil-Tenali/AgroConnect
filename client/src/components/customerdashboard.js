import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import "./farmerdashboard.css";

export default function Customerdashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  // Toggle sidebar visibility on mobile devices
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Collapsible sidebar with navigation menu */}
      <div className={`sidebar ${showSidebar ? "show-sidebar" : ""}`}>
        <div className="sidebar-header">
          <h1>Explore Menu</h1>
          <FontAwesomeIcon
            icon={faTimes}
            className="fa-times"
            onClick={handleToggleSidebar}
          />
        </div>
        <ul className="menu">
          <li>
            <NavLink to="/customerdashboard/productHome">Home</NavLink>
          </li>
          <li>
            <NavLink to="/customerdashboard/orderdetails">
              Order Details
            </NavLink>
          </li>
          <li>
            <NavLink to="/customerdashboard/customercontact">
              Contact details
            </NavLink>
          </li>
          <li>
            <NavLink to="/customerdashboard/yourorders">your Orders</NavLink>
          </li>
          <li>
            <NavLink to="/customerdashboard/shoppingcart">
              shopping cart
            </NavLink>
          </li>
          <li>
            <NavLink to="/customerdashboard/reviews">Reviews</NavLink>
          </li>
        </ul>
      </div>

      {/* Toggle button */}
      <FontAwesomeIcon
        icon={faBars}
        className="fa-bars"
        onClick={handleToggleSidebar}
      />

      {/* Main content */}
      <main className="customer-dashboard-main">
        <h2>Customer Dashboard</h2>
        <p>Welcome, {localStorage.getItem("userEmail") || "customer"}.</p>
        <p>Pick a section from the menu or continue below.</p>
        <Outlet />
      </main>
    </>
  );
}
