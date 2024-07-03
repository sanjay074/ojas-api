const express = require("express");
const router = express.Router();
const { verifyTokenAndUser } = require("../../middlewares/auth");
const { addDeliveryAddress, getUserDeliveryAddress, updateDeliveryAddress } = require("../controllers/orderController");
router.post("/deliveryAddress", verifyTokenAndUser, addDeliveryAddress);
router.get("/getDeliveryAddress", verifyTokenAndUser, getUserDeliveryAddress);
router.put("/updateAddress", verifyTokenAndUser, updateDeliveryAddress);
module.exports = router;

