const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    dob: {
      type: String
    },
    profileImage: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    agree: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
