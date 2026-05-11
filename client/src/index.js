import React from "react";
import ReactDOM from "react-dom/client";
//import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import "./index.css";
import reportWebVitals from "./reportWebVitals";
import FarmerLogin from "./components/farmerlogin.js";
import CustomerLogin from "./components/customerlogin.js";
import Main from "./components/main.js";
import CustomerSignup from "./components/customersignup.js";
import FarmerSignup from "./components/farmersignup.js";
import Farmerdashboard from "./components/farmerdashboard.js";
import Customerdashboard from "./components/customerdashboard.js";
import Home from "./pages/Home.js";
import Producthome from "./customerpages/productHome.js";
import Products from "./pages/product.js";
import Contact from "./pages/Contact.js";
import Rented from "./pages/Rented.js";
import Machinery from "./pages/Machinery.js";
import AvailableMachinery from "./pages/AvailableMachinery.js";
import Customercontact from "./customerpages/contactdetails.js";
import Customerorderdetails from "./customerpages/customerorderdetails.js";
import ShoppingCart from "./customerpages/ShoppingCart.js";
import CustomerReviews from "./customerpages/CustomerReviews.js";
import Reviews from "./pages/Reviews.js";
import "./stylesheets/styles.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/farmerLogin" element={<FarmerLogin />} />
        <Route path="/customerLogin" element={<CustomerLogin />} />
        <Route path="/farmerSignup" element={<FarmerSignup />} />
        <Route path="/customerSignup" element={<CustomerSignup />} />
        <Route path="/farmerdashboard" element={<Farmerdashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="contact" element={<Contact />} />
          <Route path="machinery" element={<Machinery />} />
          <Route path="available-machinery" element={<AvailableMachinery />} />
          <Route path="rented" element={<Rented />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>
        <Route path="/customerdashboard" element={<Customerdashboard />}>
          <Route index element={<Producthome />} />
          <Route path="producthome" element={<Producthome />} />
          <Route path="orderdetails" element={<Customerorderdetails />} />
          <Route path="customercontact" element={<Customercontact />} />
          <Route path="yourorders" element={<Customerorderdetails />} />
          <Route path="shoppingcart" element={<ShoppingCart />} />
          <Route path="reviews" element={<CustomerReviews />} />
        </Route>
      </Routes>
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
