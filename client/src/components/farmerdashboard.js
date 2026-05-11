import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./farmerdashboard.css";

export default function Farmerdashboard() {
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

    navigate("/farmerLogin");
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
          <NavLink to="/farmerdashboard/home" onClick={handleToggleSidebar}>
            Home
          </NavLink>

          <NavLink to="/farmerdashboard/products" onClick={handleToggleSidebar}>
            Products Details
          </NavLink>

          <NavLink to="/farmerdashboard/contact" onClick={handleToggleSidebar}>
            Contact details
          </NavLink>

          <NavLink to="/farmerdashboard/machinery" onClick={handleToggleSidebar}>
            Your Machinery
          </NavLink>

          <NavLink
            to="/farmerdashboard/availablemachinery"
            onClick={handleToggleSidebar}
          >
            Available Machinery
          </NavLink>

          <NavLink to="/farmerdashboard/rented" onClick={handleToggleSidebar}>
            Rented
          </NavLink>

          <NavLink to="/farmerdashboard/reviews" onClick={handleToggleSidebar}>
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
        <h2>Farmer Dashboard</h2>
        <p>Welcome, {sessionStorage.getItem("userName") || "farmer"}.</p>

        <Outlet />
      </main>
    </>
  );
}