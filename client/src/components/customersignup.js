import React from "react";
import { useState } from "react";
import "../stylesheets/signup.css";
import Videobg from "../assets/agro9.mp4";

function Customersignup() {
  const [signedUp, setSignedUp] = useState(false);
  const [submitButtonValue, setSubmitButtonValue] = useState("Sign Up ➡️");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    user_type: "1",
  });

  // Update form state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle customer registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send registration request to backend
      const response = await fetch("http://localhost:4000/customersignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSignedUp(true);
        setSubmitButtonValue("Signed up");
        alert("You have successfully signed up! \n Go back to login page");
        // TODO: Redirect to login page instead of showing alert
      } else {
        alert(
          "Oops! It seems like you're already registered or the email provided is incorrect. Please double-check your information and try again."
        );
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <div className="mainn">
        <div className="overlay"></div>
        <video src={Videobg} autoPlay loop muted />
      </div>
      <form className="content">
        <h1>Welcome to AgroConnect - Customer Signup</h1>
        <p>Create Your Account</p>
        <label htmlFor="firstname" id="yn">
          First Name
        </label>
        <br />
        <input
          type="text"
          id="firstname"
          name="fname"
          placeholder="First Name"
          value={formData.fname}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="lastname" id="yn">
          Last Name
        </label>
        <br />
        <input
          type="text"
          id="lastname"
          name="lname"
          placeholder="Last Name"
          value={formData.lname}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="emailsignup">Your Email</label>
        <br />
        <input
          type="email"
          id="emailsignup"
          name="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="passwordcustomer">Password </label>
        <br />
        <input
          type="password"
          id="passwordcustomer"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <br />
        <p className="pp">
          By creating an account, you agree to our Terms & Conditions and
          Privacy Policy.
        </p>
        <input
          id="submitsignupform"
          type="submit"
          onClick={handleSubmit}
          value={submitButtonValue}
          disabled={signedUp}
        />
        <p>Need help? [Contact Us Link]</p>
      </form>
    </>
  );
}

export default Customersignup;
