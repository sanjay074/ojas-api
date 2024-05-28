const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {registrationUserSchema,userLoginSchema} = require("../../validators/authValidator");


exports.registrationUser = async (req, res) => {
   try{
    const {name,email,password,userName} = req.body;
    const { error } = registrationUserSchema.validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const exist = await User.exists({ email: req.body.email });
    if (exist) {
      return res.status(400).json({status:0, message:"This email is already taken!"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        userName,
        email,
        password:hashedPassword
    })
    const saveUserData = await newUser.save();
    res.status(200).json({status:1, message:"User registration is sucessfully"});

   }catch(error){
    console.log(error);
    return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
   }
    
  }

  exports.userLogin = async (req, res) => {
    try {
      const {error}= userLoginSchema.validate(req.body);
      if(error){
        return res.status(400).json(error.details[0].message)
      }
     const user = await User.findOne({
        $or: [{ email: req.body.email}, { userName: req.body.userName }],
      });
      if (!user) {
        return res.status(400).json({status:0, message: 'Invalid credentials'});
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(400).json({status:0, message: 'Invalid credentials'});
      } else {
        const token = jwt.sign(
          {
            id: user._id
          },
          process.env.JWT_SER,
          { expiresIn: "30d" }
        );
        res.status(200).json({status:1, message: "User is login sucessfully", token });
      }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
          });
    }
  };