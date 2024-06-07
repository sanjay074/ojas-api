const express = require("express");
const router = express.Router();
const {addToCart,removeFromCart,getCart} = require("../controllers/cartController");
router.post('/add', addToCart);
router.post('/remove',removeFromCart);
router.get('/getCart/:id', getCart);

module.exports = router;
