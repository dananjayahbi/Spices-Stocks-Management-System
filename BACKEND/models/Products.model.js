const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newProduct = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    wholeSalePrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    stocks: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Products", newProduct);

module.exports = Products;