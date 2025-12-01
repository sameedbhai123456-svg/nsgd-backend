const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  date: String,
  description: String,
  amount: Number
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
