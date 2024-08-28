const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'amount'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
