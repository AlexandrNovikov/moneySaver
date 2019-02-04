const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const transactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  createdAt: String,
});

const categorySchema = new mongoose.Schema({
    _userId: ObjectId,
    name: String,
    description: String,
    isIncome: Boolean,
    transactions: [transactionSchema],
});

// Export Mongoose "Category" model
module.exports = mongoose.model('Category', categorySchema);
