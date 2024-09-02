const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId,  refPath: 'products.itemType', },
      itemType: {
        type: String,
        required: true,
        enum: ['Coures', 'Fabric'],
      },
      quantity: { type: Number},
    }],
    totalAmount: { type: Number, required: true },
    orderId:{
      type:String,
      required:true
  },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);




