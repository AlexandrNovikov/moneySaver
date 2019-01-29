const mongoose = require('mongoose');

// Mongoose Model
const transactionSchema = new mongoose.Schema({
    id: String,
    userId: String,
    categoryId: String,
    amount: Number,
    description: String,
    dateTime: { type: Date, default: Date.now },
    isIncome: Boolean
});

// Export Mongoose "Transaction" model
module.exports = mongoose.model('Transaction', transactionSchema);
