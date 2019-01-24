const mongoose = require('mongoose');

// Mongoose Model
const categorySchema = new mongoose.Schema({
    id: String,
    userId: String,
    name: String,
    description: String
});

// Export Mongoose "Category" model
module.exports = mongoose.model('Category', categorySchema);