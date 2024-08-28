const Coures = require("../models/coures");
const mongoose = require("mongoose")
const { addCouresSchema } = require("../../validators/authValidator");
const cloudinary = require("../../utils/cloudinary");
exports.addCoures = async (req, res) => {
  try {
    const { error } = addCouresSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter - file"
      });
    }

    cloudinary.uploader.upload_stream({
      resource_type: 'image'
    }, async (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message.toString(),
        });
      }

      const { couresName, totalPrice, title, discount, description, type } = req.body;

      const exist = await Coures.findOne({ couresName });
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "This course name is already taken!"
        });
      }
      if (type === 'paid') {
        if(!totalPrice || !discount){
          return res.status(400).json({
            status:false,
            message:"Total parice and discount is required"
          })
        }
        const discountedPrice = totalPrice - (totalPrice * (discount / 100));
        const newCourse = new Coures({
        couresName,
        discount,
        totalPrice,
        title,
        price:discountedPrice,
        description,
        type,
        imageUrl: result.secure_url,
        })
        await newCourse.save();
        
      return res.status(201).json({ success: true, message: "New course created successfully" });
      
      }
      if (type === 'free') {
        const newCourse = new Coures({
        couresName,
        title,
        description,
        type,
        imageUrl: result.secure_url,
        })
        await newCourse.save();
        
      return res.status(201).json({ success: true, message: "New course created successfully" });
      
      }
  
    }).end(req.file.buffer);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message.toString(),
    });
  }
};


exports.getAllCoures = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * 10;
    const getAllCoures = await Coures.find().skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Find all  coures list ", getAllCoures });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};


exports.getOneCoures = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ status: 0, message: "Invalid course ID" });
    }
    const getOneCoures = await Coures.findById(req.params.id);
    if (!getOneCoures) {
      return res.status(400).json({ success: false, message: "Course not found with this ID" })
    }
    res.status(200).json({ status: 1, message: "Find all  coures list ", getOneCoures });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};


exports.getAllFreeCoures = async (req, res) => {
  try {
    const freeCourses = await Coures.find({ type: "free" }, { updatedAt: 0, __v: 0 }).sort({ createdAt: -1 });
    if (freeCourses.length === 0) {
      return res.status(400).json({ success: false, message: "No free courses available" })
    }
    return res.status(200).json({ message: "Find all free course list sucessfully", freeCourses })
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
}


exports.getAllpaidCoures = async (req, res) => {
  try {
    const paidCourses = await Coures.find({ type: "paid" }, { updatedAt: 0, __v: 0 }).sort({ createdAt: -1 });
    if (paidCourses.length === 0) {
      return res.status(400).json({ success: false, message: "No paid courses available" })
    }
    return res.status(200).json({ success: true, message: "Find all paid course list sucessfully", paidCourses })
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
}


exports.deleteCoures = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }
    const getOneCoures = await Coures.findByIdAndDelete(courseId);
    if (!getOneCoures) {
      return res.status(400).json({ success: false, message: "Course not found with this ID" })
    }
    res.status(200).json({ success: true, message: "Couress delete sucessfully" });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};


exports.updateCoures = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }
  //   if (!req.file) {
  //     return res.status(400).json({
  //         status: 0,
  //         message: "Missing required parameter - file"
  //     });
  // }
  const coures = await Coures.findById(courseId);
  if(!coures){
    return res.status(404).json({
      status: 0,
      message: "Coures not found"
  });
  }
  const oldImageUrl = coures.imageUrl;
  const oldPublicId = oldImageUrl.split('/').pop().split('.')[0];
  cloudinary.uploader.destroy(oldPublicId, async (error, result) => {
    if (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
        if (error) {
            return res.status(500).json({
                status: 0,
                message: error.message.toString(),
            });
        }
        const {discount,totalPrice } = req.body;
        const discountedPrice = totalPrice - (totalPrice * (discount / 100));
        coures.imageUrl = result.secure_url;
        coures.price=discountedPrice;
        coures.couresName = req.body.couresName || coures.couresName;
        coures.title = req.body.title || coures.title;
        coures.totalPrice=req.body.totalPrice || coures.totalPrice;
        coures.discount=req.body.discount || coures.discount;
        coures.type=req.body.type||coures.type;
        await coures.save();
        return res.status(200).json({
            success: true,
            message: "Coures data updated successfully",
        });
    }).end(req.file.buffer);
});

  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    })
  }
}

