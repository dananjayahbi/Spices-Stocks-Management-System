const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newProduct = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Products", newProduct);

module.exports = Products;