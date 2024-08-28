const Coupon = require("../models/coupon");
const mongoose = require("mongoose");
const { couponValidationSchema } = require("../../validators/authValidator");

exports.addCoupon = async (req, res) => {
    const { error } = couponValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { code, discountType, discountValue, expirationDate: providedExpirationDate } = req.body;
    try {
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }
        let expirationDate;
        if (providedExpirationDate) {
            expirationDate = new Date(providedExpirationDate);
        } else {
            expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);
        }
        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            expirationDate
        });

        await newCoupon.save();
        return res.status(201).json({ success: true, message: 'Coupon added successfully', coupon: newCoupon });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
};


exports.getAllCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find().sort({ createdAt: -1 })
        if (coupon.length === 0) {
            return res.status(400).json({ status: false, message: "No any coupon available" })
        }
        return res.status(200).json({ status: true, message: "Get all coupon successfully", coupon })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
}

exports.getOneCouponById = async (req, res) => {
    try {
        const couponId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(couponId)) {
            return res.status(400).json({ success: false, message: "Invalid coupon ID" });
        }
        const coupon = await Coupon.findById(couponId)
        if (!coupon) {
            return res.status(400).json({ status: false, message: "Coupon not found with this ID" })
        }
        return res.status(200).json({ status: true, message: "Get  coupon successfully", coupon })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
}


exports.deleteCouponById = async (req, res) => {
    try {
        const couponId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(couponId)) {
            return res.status(400).json({ success: false, message: "Invalid coupon ID" });
        }
        const coupon = await Coupon.findByIdAndDelete(couponId);
        if (!coupon) {
            return res.status(400).json({ status: false, message: "Coupon not found with this ID" })
        }
        res.status(200).json({ success: true, message: "Coupon delete sucessfully" });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(couponId)) {
            return res.status(400).json({ success: false, message: "Invalid coupon ID" });
        }
      const updateCoupon = await Coupon.findByIdAndUpdate(couponId, { $set: req.body }, { new: true });
      return res.status(200).json({
        success: true,
        message: "Coupon data update successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      })
    }
  }