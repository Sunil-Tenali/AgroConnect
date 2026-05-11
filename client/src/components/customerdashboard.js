import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./farmerdashboard.css";
import "../stylesheets/styles.css";

export default function Customerdashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("addressid");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userType");

    navigate("/customerLogin");
  };

  return (
    <>
      <aside className={`sidebar ${showSidebar ? "show-sidebar" : ""}`}>
        <div className="sidebar-header">
          <h1>Explore Menu</h1>

          <FontAwesomeIcon
            icon={faTimes}
            className="fa-times"
            onClick={handleToggleSidebar}
          />
        </div>

        <nav className="menu">
          <NavLink to="/customerdashboard/producthome" onClick={handleToggleSidebar}>
            Home
          </NavLink>

          <NavLink
            to="/customerdashboard/orderdetails"
            onClick={handleToggleSidebar}
          >
            Your Order Details
          </NavLink>

          <NavLink
            to="/customerdashboard/customercontact"
            onClick={handleToggleSidebar}
          >
            Contact details
          </NavLink>
          <NavLink
            to="/customerdashboard/shoppingcart"
            onClick={handleToggleSidebar}
          >
            Shopping Cart
          </NavLink>

          <NavLink
            to="/customerdashboard/reviews"
            onClick={handleToggleSidebar}
          >
            Reviews
          </NavLink>

          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <FontAwesomeIcon
        icon={faBars}
        className="fa-bars"
        onClick={handleToggleSidebar}
      />

      <main className="dashboard-main">
        <h2>Customer Dashboard</h2>
        <p>Welcome, {sessionStorage.getItem("userEmail") || "customer"}.</p>

        <Outlet />
      </main>
    </>
  );
}