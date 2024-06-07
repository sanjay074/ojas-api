const { model, Schema } = require("mongoose");
const couresId = require("../models/coures");
const User = require("../models/user");
const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  items: [
    {
     couresId: {
        type: Schema.Types.ObjectId,
        ref: couresId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
    },
  ],
});
module.exports = model("Cart", cartSchema);