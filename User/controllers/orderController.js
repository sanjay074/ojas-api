const UserAddress = require("../models/userAddress");
const Order = require("../models/order");
const User = require("../models/user");
const Fabric = require("../models/fabricStore");
const { userAddressJoiSchema, updateUserAddressJoiSchema, orderSchema } = require("../../validators/authValidator");
const { default: mongoose } = require("mongoose");

exports.addDeliveryAddress = async (req, res) => {
    try {
        const { error } = userAddressJoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const { email, mobileNumber, fullName, deliveryAddress } = req.body;
        const newAddress = new UserAddress({
            fullName,
            email,
            mobileNumber,
            userId: req.user.id,
            deliveryAddress: {
                state: deliveryAddress.state,
                distrct: deliveryAddress.distrct,
                city: deliveryAddress.city,
                pinCode: deliveryAddress.pinCode,
                houseNo: deliveryAddress.houseNo
            }
        });
        const saveDeliveryAddress = await newAddress.save();
        return res.status(201).json({
            success: true,
            message: "Delivery address saved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
};

exports.getUserDeliveryAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const userAddress = await UserAddress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!userAddress) {
            return res.status(404).json({
                success: false,
                message: 'Delivery address not found',
            });
        }
        const userData = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            userAddress
        };
        return res.status(200).json({
            message: "Get user delivery address successfully",
            success: true,
            data: userData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateDeliveryAddress = async (req, res) => {
    try {
        const { error } = updateUserAddressJoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const userId = req.user.id;
        const userAddress = await UserAddress.findOne({ userId });
        if (!userAddress) {
            return res.status(404).json({
                success: false,
                message: 'Delivery address not found',
            });
        }
        userAddress.fullName = req.body.fullName;
        userAddress.email = req.body.email;
        userAddress.mobileNumber = req.body.mobileNumber;
        userAddress.deliveryAddress.state = req.body.deliveryAddress.state;
        userAddress.deliveryAddress.distrct = req.body.deliveryAddress.distrct;
        userAddress.deliveryAddress.city = req.body.deliveryAddress.city;
        userAddress.deliveryAddress.pinCode = req.body.deliveryAddress.pinCode;
        userAddress.deliveryAddress.houseNo = req.body.deliveryAddress.houseNo;
        await userAddress.save();

        return res.status(200).json({
            success: true,
            message: 'Delivery address updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.placeOrder = async (req, res) => {
    try {
        const { error, value } = orderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details.map(detail => detail.message).join(', ') });
        }
        const { userAddress, products } = value;
        const userId = req.user.id;
        // Calculate total amount
        let totalAmount = 0;
        for (const item of products) {
            const fabric = await Fabric.findById(item.productId);
            if (!fabric) {
                return res.status(400).json({ message: `Product with id ${item.productId} not found` });
            }
            totalAmount += fabric.price * item.quantity;
        }

        const order = new Order({
            userId: userId,
            userAddress,
            products,
            totalAmount,
        });

        await order.save();

        return res.status(201).json({
            status: true,
            message: 'Order placed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.toString(),
        })
    }
}


exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ status: 0, message: "Invalid order ID" });
        }
        const order = await Order.findById(orderId)
            .populate('userId', 'name email')
            .populate('userAddress')
            .populate('products.productId', 'name price');

        if (!order) {
            return res.status(404).json({ status: false, message: 'Order not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Order fetched successfully',
            order,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.toString()
        })
    }
}



exports.adminGetOrderDetails = async (req, res) => {
    try {
        const order = await Order.find().populate('userId', 'name email')
            .populate('userAddress')
            .populate('products.productId', 'name price');

        if (order.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No  available any order details", order
            })
        }
        return res.status(200).json({
            status: true,
            message: "Order fetched successfully",
            order,
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.toString()
        })
    }
}

exports.adminUpdateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                status: 0,
                message: "Order id invaild"
            })
        }
        const order = Order.findOne(orderId);
        if (!order) {
            return res.status(400).json({
                status: 0,
                message: "Order id not found"
            })
        }
        const { status } = req.body;
        const orderStatus = await Order.findByIdAndUpdate(orderId, { status: status });
        return res.status(200).json({
            status: true,
            message: "Order status update successfully",
        })

    } catch (error) {
        return res.status(200).json({
            status: false,
            message: error.toString()
        })
    }
}

exports.findByUserIdAndCancelledOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cancelledOrder = await Order.find({ userId: userId, status: "Cancelled" }).populate('userId', 'name email')
            //.populate('userAddress')
            .populate('products.productId', 'name price imageUrl title discount totalPrice');
        return res.status(200).json({
            status: true,
            message: "Cancelled order fetched successfully",
            cancelledOrder,
        })
    } catch (error) {
        return res.status(200).json({
            status: false,
            message: error.toString()
        })
    }
}


exports.findByUserIdAndDeliveredOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const deliveredOrder = await Order.find({ userId: userId, status: "Delivered" }).populate('userId', 'name email')
            //.populate('userAddress')
            .populate('products.productId', 'name price imageUrl title discount totalPrice');
        return res.status(200).json({
            status: true,
            message: "Delivered  order fetched successfully",
            deliveredOrder,
        })
    } catch (error) {
        return res.status(200).json({
            status: false,
            message: error.toString()
        })
    }
}







