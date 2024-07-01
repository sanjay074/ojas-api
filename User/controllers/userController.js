const User = require("../models/user");
const Coures = require("../models/coures");
const Class = require("../models/class");
const {userUpdateProfileSchema} = require("../../validators/authValidator");
const cloudinary = require("../../utils/cloudinary");
exports.userUpdateProfile =async (req,res)=>{
    try {
        const { name, userName, email } =
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
             userName,email
            },
            { upsert: true },
            { new: true })
          );
          if (newUser) {
            return res.status(200).json({
              success:true,
              message: "User update profile  sucessfully",
            });
          } else {
            return res.status(400).json({
              success:false,
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
      const updateCoures = await User.findByIdAndUpdate(req.user.id,updateData,{new:true});
      return res.status(200).json({
        success:true,
        message: "Profile image upload successfully",

      });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message.toString(),
    });
  }
};