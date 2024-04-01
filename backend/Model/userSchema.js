const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema
const AuthSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique
    },
    PhoneNUm: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false // Default value is false for regular users
    }
});



// Create a model
const User = mongoose.model('User', AuthSchema);

module.exports = User;