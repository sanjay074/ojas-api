const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require('twilio');
const User = require("../models/user");
const {registrationUserSchema,userLoginSchema} = require("../../validators/authValidator");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Ensure phone numbers are in E.164 format
const formatPhoneNumber = (phoneNumber) => {
  // Add your logic to prepend country code based on your requirements
  // Here, we're assuming country code +91 for India
  return phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
};


exports.loginWithPhone = async (req,res)=>{
  try{
    const { phoneNumber } = req.body;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    twilioClient.verify.services(process.env.TWILIO_SERVICE_SID)
        .verifications
        .create({ to: formattedPhoneNumber, channel: 'sms' })
        .then(verification => res.status(200).send({ success: true, message: 'OTP sent successfully' }))
        .catch(error => res.status(500).send({ success: false, message: error.message }));
  }catch(error){
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
 }
  }

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