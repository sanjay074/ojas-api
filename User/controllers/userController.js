const User = require("../models/user");
const Coures = require("../models/coures");
const Class = require("../models/class");
const Order = require("../models/order");
const { userUpdateProfileSchema } = require("../../validators/authValidator");
const cloudinary = require("../../utils/cloudinary");
const { default: mongoose } = require("mongoose");
exports.userUpdateProfile = async (req, res) => {
  try {
    const { name, dob, email, agree, gender } =
      req.body;
    const { error } = userUpdateProfileSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    } else {
      const newUser = await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        ({
          name,
          dob, email, agree, gender
        },
          { upsert: true },
          { new: true })
      );
      if (newUser) {
        return res.status(200).json({
          success: true,
          message: "User update profile  sucessfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }

}
exports.getUserData = async (req, res) => {
  try {
    const getallData = await User.find({}, { password: 0 })

    if (getallData.length === 0) {
      return res.status(200).json({ message: " empty user " })
    }
    return res.status(200).json({
      message: "Get all users lists", getallData
    })

  } catch (err) {
    res.json({ message: "data fetch error ", err })

  }
}


exports.profileImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 0,
        message: "Missing required parameter - file"
      });
    }
    const updateData = req.body;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(req.file.buffer);
      });

      updateData.profileImage = result.secure_url;
    }
    const updateCoures = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    return res.status(200).json({
      success: true,
      message: "Profile image upload successfully",

    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message.toString(),
    });
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "invalid user id " })
    }
    const userdeleteId = await User.findByIdAndDelete(req.params.id)
    //  console.log(userdeleteId);
    if (!userdeleteId) {
      return res.status(400).json({ message: "user id not found " })
    }
    res.status(200).json({ message: "user id deleted sucessesfull" })

  } catch (error) {
    res.status(500).json({ message: "user id not delete", error })
  }

};


exports.userProfileDetails = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id, { __v: 0, _id: 0, agree: 0, createdAt: 0, updatedAt: 0 });
    return res.status(200).json({ status: true, message: "Get user details successfully", userDetails })
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message.toString(),
    })
  }
}


exports.userGetOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user.id })
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