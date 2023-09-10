const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newReport = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", newReport);

module.exports = Report;