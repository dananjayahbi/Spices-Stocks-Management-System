const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newUser = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", newUser);

module.exports = Users;