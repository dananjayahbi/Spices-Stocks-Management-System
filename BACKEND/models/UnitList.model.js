const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newUnit = new Schema(
  {
    unitName: {
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

const Unit = mongoose.model("Unit", newUnit);

module.exports = Unit;