const UserAddress = require("../models/userAddress");
const Order = require("../models/order");
const User = require("../models/user");
const { userAddressJoiSchema, updateUserAddressJoiSchema } = require("../../validators/authValidator");
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
};


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