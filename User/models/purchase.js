const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coures",
        required: true,
      },
      paymentId:{
        type:String,
      },
      purchaseDate: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Purchase", purchaseSchema);
  