const  mongoose  = require("mongoose");
const Cart = require("../models/cart");
exports.addToCart = async (req, res) => {
    const { couresId, quantity } = req.body;
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            // Check if product exists in cart
            let itemIndex = cart.items.findIndex(p => p.couresId == couresId);
            if (itemIndex > -1) {
                // Product exists in the cart, update the quantity
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
            } else {
                // Product does not exist in the cart, add new item
                cart.items.push({ couresId, quantity });
            }
            cart = await cart.save();
            return res.status(200).send(cart);
        } else {
            // No cart for user, create new cart
            const newCart = new Cart({
                userId,
                items: [{ couresId, quantity }]
            });
            await newCart.save();
            return res.status(201).json({success:true,message:"User add to cart sucessfully",cart});
        }
    } catch (err) {
        return res.status(500).json({
            status:0,
            message:err.message.toString(),
        })
    }
};


exports.removeFromCart = async (req, res) => {
    const {productId } = req.body;
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.productId !== productId);
            cart = await cart.save();
            return res.status(200).json({success:true,message:"User item remove from cart sucessfully"});
        } else {
            return res.status(400).json({success:false,message:"Cart not found"});
        }
    } catch (err) {
        return res.status(500).json({
            status:0,
            message:err.message.toString(),
        })
    }
};

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({ status: 0, message: "Invalid user ID" });
    }
    try {
        let cart = await Cart.findOne({ userId }).populate("items.couresId");
        if (cart) {
            return res.status(200).json({success:true,message:"User cart details get sucessfully",cart});
        } else {
            return res.status(400).json({success:false,message:"Cart not found"});
        }
    } catch (err) {
        return res.status(500).json({
            status:0,
            message:err.message.toString(),
        })
    }
};
