const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const categorySchema = new mongoose.Schema({
    userId: String,
    name: String,
    description: String,
    isIncome: Boolean,
    transactions: [transactionSchema],
});

// Export Mongoose "Category" model
module.exports = mongoose.model('Category', categorySchema);
