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
    userName: {
      type: String
    },
    imageUrl: {
      type: String,
    },
    password:{
        type:String
    }
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
