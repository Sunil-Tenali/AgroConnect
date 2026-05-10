import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import "./farmerdashboard.css";

export default function Farmerdashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Sidebar */}

      <div className={`sidebar ${showSidebar ? "show-sidebar" : ""}`}>
        <div className="sidebar-header">
          <h1> Explore Menu </h1>
          {/*<h2>Grow with Agro Connect</h2>*/}
          <FontAwesomeIcon
            icon={faTimes}
            className="fa-times"
            onClick={handleToggleSidebar}
          />
        </div>
        <ul className="menu">
          <li>
            <NavLink to="/farmerdashboard/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/farmerdashboard/products">Products Details</NavLink>
          </li>
          <li>
            <NavLink to="/farmerdashboard/Contact">Contact details</NavLink>
          </li>
          <li>
            <NavLink to="/farmerdashboard/machinery">Your Machinery</NavLink>
          </li>
          <li>
            <NavLink to="/farmerdashboard/available-machinery">
              Available Machinery
            </NavLink>
          </li>
          <li>
            <NavLink to="/farmerdashboard/rented">Rented</NavLink>
          </li>
          <li>
            <NavLink to="/farmerdashboard/reviews">Reviews</NavLink>
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
      <main className="farmer-dashboard-main">
        <h2>Farmer Dashboard</h2>
        <p>Welcome, {localStorage.getItem("userEmail") || "farmer"}.</p>
        <p>Pick a section from the menu or continue below.</p>
        <Outlet />
      </main>
    </>
  );
}
