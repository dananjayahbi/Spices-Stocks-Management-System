const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newPurchase = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchase", newPurchase);

module.exports = Purchase;