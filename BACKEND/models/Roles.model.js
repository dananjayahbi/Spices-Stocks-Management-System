const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newRole = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    permissions: [
      {
        page: String,
        access: Boolean,
      },
    ],
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Roles = mongoose.model("Roles", newRole);

module.exports = Roles;
