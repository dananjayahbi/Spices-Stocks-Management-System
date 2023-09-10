const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newSupplier = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Suppliers = mongoose.model("Suppliers", newSupplier);

module.exports = Suppliers;