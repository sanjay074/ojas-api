const UserAddress = require("../models/userAddress");
const Order = require("../models/order");
const User = require("../models/user");
const Fabric = require("../models/fabricStore");
const Coures = require("../models/coures");
const mongoose = require("mongoose");
const { userAddressJoiSchema, updateUserAddressJoiSchema, orderSchema } = require("../../validators/authValidator");


const generateOrderId = () => {
    const prefix = 'OD';
    const timestamp = Date.now().toString();
    const uniquePart = Math.floor(100000 + Math.random() * 900000).toString(); 
    return prefix + timestamp.slice(-6) + uniquePart; 
  };


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
                houseNo: deliveryAddress.houseNo,
                fullAddress:deliveryAddress.fullAddress,
                addressType:deliveryAddress.addressType,
                landmark:deliveryAddress.landmark,
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
        const userAddress = await UserAddress.find({ userId: new mongoose.Types.ObjectId(userId) });
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
        const userAddressId= req.params.id;
        if(!mongoose.Types.ObjectId.isValid(userAddressId)){
            return res.status(400).json({
                success:false,
                message:"Id not found"
            })
        }
        const userAddress = await UserAddress.findById(userAddressId);
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
        userAddress.deliveryAddress.fullAddress=req.body.deliveryAddress.fullAddress;
        userAddress.deliveryAddress.landmark=req.body.deliveryAddress.landmark;
        userAddress.deliveryAddress.addressType=req.body.deliveryAddress.addressType;
        await userAddress.save();
    
        return res.status(200).json({
            success: true,
            message: 'Delivery address updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message.toString(),
        });
    }
}

exports.removeDeliveryAddress = async (req,res)=>{
    try{
     const id = req.params.id;
     if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
              success:false,
              message:"Invalid user address ID"
        })
     }
     const removeAddress = await UserAddress.findByIdAndDelete(id);
     if (!removeAddress) {
        return res.status(400).json({ success: false, message: "UserAddress not found with this ID" })
      }
     return res.status(200).json({
        success:true,
        message:"Remove delivery address successfully"
     })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message.toString(),
        })
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
        let totalAmount = 0;
        const orderId = generateOrderId();
        for (const item of products) {
            if (item.itemType === 'Fabric') {
                const fabric = await Fabric.findById(item.productId);
                if (!fabric) {
                    return res.status(400).json({ message: `Fabric with id  not found` });
                }
                totalAmount += fabric.price * item.quantity;
            } else if (item.itemType === 'Coures') {
                const coures = await Coures.findById(item.productId);
                if (!coures) {
                    return res.status(400).json({ message: `Course with id  not found` });
                }
                totalAmount += coures.price; 
            }
        }

        const order = new Order({
            userId: userId,
            userAddress,
            products,
            totalAmount,
            orderId:orderId
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
        });
    }
};



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
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('userAddress')
            .populate('products.productId').sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No available order details"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Order fetched successfully",
            orders,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.toString()
        });
    }
}


exports.getOneOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                status: 0,
                message: "Order id invaild"
            })
        }
        const order = await Order.findById(orderId).populate('userId', 'name email')
        .populate('userAddress')
        .populate('products.productId')

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
            message: "Delivered  order fetched  successfully",
            deliveredOrder,
        })
    } catch (error) {
        return res.status(200).json({
            status: false,
            message: error.toString()
        })
    }
}








