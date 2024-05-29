const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminUser");
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
       return res.status(400).json({status:0, message:"This email is already taken!"});
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = new AdminUser({
         userName,
         email,
         password:hashedPassword
     })
     const saveUserData = await newUser.save();
     res.status(200).json({status:1, message:"Admin user registration is sucessfully"});
 
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
        return res.status(400).json({status:0, message: 'Invalid credentials'});
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(400).json({status:0, message: 'Invalid credentials'});
      } else {
        const token = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SER,
          { expiresIn: "30d" }
        );
        res.status(200).json({status:1, message: "Admin user is login sucessfully", token });
      }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
          });
    }
  }; 