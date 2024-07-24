const express = require("express");
const router = express.Router();
const { verifyTokenAndUser, verifyTokenAndAdmin } = require("../../middlewares/auth");
const { addDeliveryAddress, getUserDeliveryAddress, updateDeliveryAddress, placeOrder, getOrderDetails, adminGetOrderDetails } = require("../controllers/orderController");
router.post("/deliveryAddress", verifyTokenAndUser, addDeliveryAddress);
router.get("/getDeliveryAddress", verifyTokenAndUser, getUserDeliveryAddress);
router.put("/updateAddress", verifyTokenAndUser, updateDeliveryAddress);
router.post("/placeOrder", verifyTokenAndUser, placeOrder);
router.get("/getOrderDetails/:id", verifyTokenAndUser, getOrderDetails);
router.get("/adminGetOrderDetails", verifyTokenAndAdmin, adminGetOrderDetails);
module.exports = router;

