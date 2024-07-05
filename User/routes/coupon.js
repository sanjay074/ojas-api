const express = require("express");
const router = express();
const { verifyTokenAndAdmin, verifyTokenAndUser } = require("../../middlewares/auth");
const { addCoupon, getAllCoupon, getOneCouponById, deleteCouponById } = require("../controllers/couponController");
router.post("/addNewCoupon", verifyTokenAndAdmin, addCoupon);
router.get("/getAllCoupon", verifyTokenAndAdmin, getAllCoupon);
router.get("/getOneCouponById/:id", verifyTokenAndAdmin, getOneCouponById);
router.delete("/deleteCouponById/:id", verifyTokenAndAdmin, deleteCouponById);
module.exports = router;