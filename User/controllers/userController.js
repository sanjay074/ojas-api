const User = require("../models/user");
const Coures = require("../models/coures");
const Class = require("../models/class");
const {userUpdateProfileSchema} = require("../../validators/authValidator");

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