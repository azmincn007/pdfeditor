import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate=useNavigate()
  const [input, setInput] = useState({
    Name: "",
    PhoneNUm: "",
    Email: "",
    Password: "",
  });
  const [errors, setErrors] = useState({});
  // Helper function to check password strength
const hasUpperCaseLetterAndSymbol = (str) => /(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/g.test(str);


  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { Name, PhoneNUm, Email, Password } = input;
  
    // Check for errors before submitting the form
    const formErrors = {};
    if (!Name) {
      formErrors.Name = "Please enter your name";
    }
    if (!PhoneNUm) {
      formErrors.PhoneNUm = "Please enter your phone number";
    }
    if (!Email) {
      formErrors.Email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      formErrors.Email = "Please enter a valid email address";
    }
    if (!hasUpperCaseLetterAndSymbol(Password)) {
      formErrors.Password = "Must contain at least one uppercase letter and one symbol.";
    }
    if (Password.length < 8) {
      formErrors.Password = "Minimum 8 characters required.";
    }
    setErrors(formErrors);
  
    // Submit the form if there are no errors

    if (Object.keys(formErrors).length === 0) {
      const display = await axios.post("http://localhost:5000/signup", {
        Name,
        PhoneNUm,
        Email,
        Password,
      });
      console.log(display.data);
      navigate("/")
    }
    
  };
  
  

  return (
    <div className="signup-main">
      <div className="signup-form">
        <div className="signup-head">
          <h2>SIGN-UP</h2>
        </div>
        <div className="signup-labels">
          <div class="input-container">
            <label for="name" class="input-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="Name"
              class="input-field"
              value={input.Name}
              onChange={handleChange}
            />
            {errors.Name && <div className="error">{errors.Name}</div>}
          </div>
          <div class="input-container">
            <label for="PhoneNUmber" class="input-label">
              Mobile Number
            </label>
            <input
              type="number"
              id="name"
              name="PhoneNUm"
              class="input-field"
              value={input.PhoneNUm}
              onChange={handleChange}
            />
            {errors.PhoneNUm && <div className="error">{errors.PhoneNUm}</div>}
          </div>
          <div class="input-container">
            <label for="email" class="input-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="Email"
              class="input-field"
              value={input.Email}
              onChange={handleChange}
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              title="Please enter a valid email address"
            />
            {errors.Email && <div className="error">{errors.Email}</div>}
          </div>

          <div class="input-container">
      <label for="password" class="input-label">
        Password
      </label>
      <input
        type="password"
        id="name"
        name="Password"
        class="input-field"
        value={input.Password}
        onChange={handleChange}
      />
      {errors.Password && <div className="error">{errors.Password}</div>}
    </div>
        </div>

        <div className="signup-button">
          <button onClick={handleSubmit}>signup</button>
        </div>

        <div className="notsignup">
          <p>
            if you have already an account?<span><Link to={'/login'}>Login Now</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
