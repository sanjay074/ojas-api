const { model, Schema } = require("mongoose");
const couresId = require("../models/coures");
const User = require("../models/user");
const cartSchema = new Schema({
  cartBy: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  cart: [
    {
     couresId: {
        type: Schema.Types.ObjectId,
        ref: couresId,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});
module.exports = model("Cart", cartSchema);