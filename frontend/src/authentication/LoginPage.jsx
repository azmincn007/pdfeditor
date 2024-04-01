import React, {  useContext, useState } from "react";
import "./login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { LoginContext } from "../App";



function LoginPage() {
  const navigate=useNavigate()
  const [isLoggedIn, setIsLoggedIn]=useContext(LoginContext)


  const [input, setInput] = useState({
   
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
   
  
    const { Email, Password } = input;
  
    // Check for errors before submitting the form
    const formErrors = {};
   
   
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
      try {
        const response = await axios.post("http://localhost:5000/login", {
          Email,
          Password,
        });

        const token = response.data.Token;
        localStorage.setItem("token", token);
        console.log(token);
        // Decode the JWT token to extract the isadmin flag
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        const isAdmin=decodedToken.isAdmin
       
        
        console.log(isAdmin);
       
       
       

        if(isAdmin===true){
          setIsLoggedIn(true)
          navigate('/admin-landing')
        }
        else{
          setIsLoggedIn(true)
          navigate('/')
        }
       
        console.log("success", response.data);
        

      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  

  return (
    <div className="login-main">
      <div className="login-form">
        <div className="login-head">
          <h2>LOG-IN</h2>
        </div>
        <div className="login-labels">
         
         
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

        <div className="login-button">
          <button onClick={handleSubmit}>login</button>
        </div>

        <div className="notlogin">
          <p>
            if you havent registred yet! <span> <Link to={'/signup'}>Register Now</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

