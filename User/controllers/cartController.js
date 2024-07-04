const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Coures = require('../models/coures');
const Fabric = require('../models/fabricStore');
exports.addToCart = async (req, res) => {

    const userId = req.user.id;
    const { couresId, fabricId, quantity } = req.body;

    if (!userId) {
        return res.status(400).json({ status: false, message: 'User ID is required' });
    }

    if (!couresId && !fabricId) {
        return res.status(400).json({ status: false, message: 'Either couresId or fabricId is required' });
    }

    if (couresId && fabricId) {
        return res.status(400).send({ status: false, message: 'Only one of couresId or fabricId should be provided' });
    }

    try {
        let item;
        let itemType;
        let itemQuantity = quantity || 1;

        if (couresId) {
            item = await Coures.findById(couresId);
            itemType = 'Coures';
            itemQuantity = 1;
        } else if (fabricId) {
            item = await Fabric.findById(fabricId);
            itemType = 'Fabric';
        }

        if (!item) {
            return res.status(404).send('Item not found');
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            (i) => i.itemId.toString() === (couresId || fabricId) && i.itemType === itemType
        );

        if (itemIndex > -1) {
            if (itemType === 'Coures') {
                return res.status(400).json({ status: false, message: 'This Coures item is already added to the cart' });
            } else {
                cart.items[itemIndex].quantity += itemQuantity;
            }
        } else {
            cart.items.push({ itemId: item._id, itemType, quantity: itemQuantity });
        }

        await cart.save();
        res.status(200).json({ status: true, message: "Item add to cart sucessfully" });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
};

exports.removeFromCart = async (req, res) => {
    const { itemId, itemType } = req.body;
    const userId = req.user.id;
    if (!itemId || !itemType) {
        return res.status(400).json({ status: false, message: 'Item ID, and Item Type are required' });
    }
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(item =>
                !(item.itemId.toString() === itemId && item.itemType === itemType)
            );
            cart = await cart.save();
            return res.status(200).json({ success: true, message: "User item remove from cart sucessfully" });
        } else {
            return res.status(400).json({ success: false, message: "Cart not found" });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.message.toString(),
        })
    }
};

exports.getCart = async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate('items.itemId');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        if (cart.items.length === 0) {
            return res.status(200).json({ success: true, message: "User cart is empty", cart: { items: [] }, totalAmount: 0 });
        }

        // Calculate the total amount
        const totalAmount = cart.items.reduce((total, item) => {
            const itemPrice = item.itemId.sellPrice || item.itemId.price || 0;
            return total + (itemPrice * item.quantity);
        }, 0);

        res.status(200).json({ success: true, message: "Get user cart items", cart, totalAmount });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message.toString(),
        });
    }
};

