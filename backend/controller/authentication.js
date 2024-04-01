const mongoose = require('mongoose');
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const User = require('../Model/userSchema');


// Arrow function to create a new user
const createUser = async (req, res) => {
    const { Name, Email, PhoneNUm, Password } = req.body;

    try {
        // Create a new user document using the .create() function
        const salt= await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(Password,salt)
        const newUser = await User.create({
            Name,
            Email,
            PhoneNUm,
            Password: hashedPass
        });

        console.log('User created successfully:', newUser);
        res.status(201).json(newUser); // Respond with the created user
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Could not create user' }); // Respond with an error
    }
};

const LoginUser = async (req, res) => {
    const { Email, Password } = req.body;
  
    try {
      const logindata = await User.findOne({ Email });
  
      if (logindata && (await bcrypt.compare(Password, logindata.Password))) {
        const token = tokengen(logindata._id,logindata.isAdmin,logindata.Name);
        res.json({ Token: token, message: "success" });
      } else {
        res.status(401).json({ message: "Login failed. Invalid email or password." });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login." });
    }
  }



const getNameWithToken = async (req, res) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.Jwt_secret);
        
       
        const user = await User.findById(decoded.id);

        // If user is not found, return an error response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user is found, return the user's name
        res.json({ name: user.Name });
    } catch (error) {
        // Handle errors related to token verification
        res.status(401).json({ error: 'Invalid token' });
    }
};



  const tokengen = (id, isAdmin) => {
      return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
          expiresIn: '1d',
      });
  };
  
  module.exports = { tokengen };
  



module.exports = {createUser,LoginUser,getNameWithToken};
