const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fabric', required: true },
      quantity: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);




