const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newBuyer = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Buyers = mongoose.model("Customers", newBuyer);

module.exports = Buyers;