const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newSMS = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const SMS = mongoose.model("SMS", newSMS);

module.exports = SMS;