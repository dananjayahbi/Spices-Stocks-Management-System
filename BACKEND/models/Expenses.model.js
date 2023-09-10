const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newExpenses = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Expenses = mongoose.model("Expenses", newExpenses);

module.exports = Expenses;