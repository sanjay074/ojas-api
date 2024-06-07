const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminUser");
const User = require("../models/user");
const {registrationAdminUserSchema,adminUserLoginSchema}= require("../../validators/authValidator");

exports.registrationUser = async (req, res) => {
    try{
     const {email,password,userName} = req.body;
     const { error } = registrationAdminUserSchema.validate(req.body);
     if(error){
        return res.status(400).send(error.details[0].message);
         
     }
     const exist = await AdminUser.exists({ email: req.body.email });
     if (exist) {
       return res.status(400).json({success:false, message:"This email is already taken!"});
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = new AdminUser({
         userName,
         email,
         password:hashedPassword
     })
     const saveUserData = await newUser.save();
     res.status(200).json({success:true, message:"Admin user registration is sucessfully"});
 
    }catch(error){
 
     return res.status(500).json({
         status: 0,
         message: error.toString(),
       });
    }
     
   }


   exports.asminUserLogin = async (req, res) => {
    try {
      const {error}= adminUserLoginSchema.validate(req.body);
      if(error){
        return res.status(400).json(error.details[0].message)
      }
     const user = await AdminUser.findOne({email: req.body.email})
      if (!user) {
        return res.status(400).json({success:false, message: 'Invalid credentials'});
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(400).json({success:false, message: 'Invalid credentials'});
      } else {
        const token = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SER,
          { expiresIn: "30d" }
        );
        res.status(200).json({success:true, message: "Admin user is login sucessfully", token });
      }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
          });
    }


  }; 

  exports.getAllUser = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const skip = (page - 1) * 10;
      const getAllUser = await User.find().skip(skip).limit(limit).select('-password');
      res.status(200).json({success:true, message: "Find all  user list ", getAllUser});
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  };


  exports.searchOneUser = async (req, res) => {
    try {
      console.log(req.params.key);
      const searchuser = await User.find({
        $or: [
          { name: { $regex: req.params.key } },
          { userName: { $regex: req.params.key } },
        ],
      });
      res.status(200).json({success:true, message: "Search user sucessfully ", searchuser});
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
          });
    }
  };