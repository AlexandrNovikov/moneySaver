const mongoose = require('mongoose');

// Mongoose Model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

// Export Mongoose "User" model
module.exports = mongoose.model('User', userSchema);
