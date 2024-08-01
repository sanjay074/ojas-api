const { required } = require('joi');
const mongoose = require('mongoose');
const UserAddressSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   fullName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
   },
   mobileNumber: {
      type: String,
      required: true
   },
   deliveryAddress: {
      state: {
         type: String,
         required: true,
      },
      distrct: {
         type: String,
         required: true,
      },
      city: {
         type: String,
         required: true,

      },
      pinCode: {
         type: Number,
         required: true
      },
      houseNo: {
         type: Number
      },
      fullAddress:{
         type:String,
      },
      addressType: {
         type: String,
         enum: ['Home', 'Work'],
         default: "Home"
       },
       landmark:{
         type:String
       }

   },
}, { timestamps: true })

module.exports = mongoose.model("UserAddress", UserAddressSchema);