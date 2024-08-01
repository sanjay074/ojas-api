const express = require("express");
const router = express.Router();
const { verifyTokenAndUser, verifyTokenAndAdmin } = require("../../middlewares/auth");
const { addDeliveryAddress, getUserDeliveryAddress, updateDeliveryAddress, placeOrder, getOrderDetails, adminGetOrderDetails, adminUpdateOrderStatus, findByUserIdAndCancelledOrder, findByUserIdAndDeliveredOrder } = require("../controllers/orderController");
router.post("/deliveryAddress", verifyTokenAndUser, addDeliveryAddress);
router.get("/getDeliveryAddress", verifyTokenAndUser, getUserDeliveryAddress);
router.put("/updateAddress/:id", verifyTokenAndUser, updateDeliveryAddress);
router.post("/placeOrder", verifyTokenAndUser, placeOrder);
router.get("/getOrderDetails/:id", verifyTokenAndUser, getOrderDetails);
router.get("/adminGetOrderDetails", verifyTokenAndAdmin, adminGetOrderDetails);
router.put("/updateOrderStatus/:id", verifyTokenAndAdmin, adminUpdateOrderStatus);
router.get("/cancelledOrder", verifyTokenAndUser, findByUserIdAndCancelledOrder);
router.get("/deliveredOrder", verifyTokenAndUser, findByUserIdAndDeliveredOrder);

module.exports = router;

