const { boolean } = require("joi");
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
    // gender: {
    //   type: String,
    //   enum: ["Male", "Female"],
    //   default: "",
    // },
    agree: {
      type: Boolean,
      default: true
    }
    // password:{
    //     type:String
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
