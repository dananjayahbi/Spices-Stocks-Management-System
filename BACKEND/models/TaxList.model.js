const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newTax = new Schema(
  {
    taxName: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TaxList = mongoose.model("TaxList", newTax);

module.exports = TaxList;