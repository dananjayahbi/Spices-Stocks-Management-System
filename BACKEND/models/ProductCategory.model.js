const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newProductCategory = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProductCategory = mongoose.model("ProductCategory", newProductCategory);

module.exports = ProductCategory;