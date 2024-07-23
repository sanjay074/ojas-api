const mongoose = require("mongoose");
const couresSchema = new mongoose.Schema(
  {
    couresName: {
      type: String,
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Coures', 'Fabric'],
      default: "Coures"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coures", couresSchema);
