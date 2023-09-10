const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newSale = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", newSale);

module.exports = Sales;