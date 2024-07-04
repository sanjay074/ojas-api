const express = require("express");
const router = express.Router();
const { verifyTokenAndUser } = require("../../middlewares/auth");
const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");
router.post('/add', verifyTokenAndUser, addToCart);
router.post('/remove', verifyTokenAndUser, removeFromCart);
router.post('/getCart', verifyTokenAndUser, getCart);

module.exports = router;
