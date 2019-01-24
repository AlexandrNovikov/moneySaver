const mongoose = require('mongoose');

// Mongoose Model
const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    email: String,
    password: String,
});

// Export Mongoose "User" model
module.exports = mongoose.model('User', userSchema);
