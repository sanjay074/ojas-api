const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user");
const { registrationUserSchema, userLoginSchema, phoneSchema, otpSchema } = require("../../validators/authValidator");

/**
 * @param {*} req
 * @param {*} res
 * @returns data
 * @description  🙂🙂🙂User login with phone🙂🙂🙂
 * @date 11/06/2024
 * @author Sanjay Kumar
 **/
exports.phoneLogin = (req, res) => {
  const { error } = phoneSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.phone === "9999999999" || req.body.phone === "8888888888") {
    return res.status(200).send({
      success: true,
      details: "f7a3883f-840d-48a9-ac82-e59e47399eb3",
      message: "Dummy Account Login",
      otp: "Enter any 6 digit otp",
    });
  }
  axios
    .get(
      "https://2factor.in/API/V1/ad542ca6-24b4-11ef-8b60-0200cd936042/SMS/" +
      req.body.phone +
      "/AUTOGEN/User verification"
    )
    .then(function (response) {
      return res.status(200).json({
        success: "otp sent successfully",
        details: response.data.Details,
      });
    })
    .catch((er) => {
      return res.status(500).json({ message: "Error", error: er.name });
    });
};

/**
 * @param {*} req
 * @param {*} res
 * @returns data
 * @description  🙂🙂🙂User verifyOTP 🙂🙂🙂
 * @date 11/06/2024
 * @author Sanjay Kumar
 **/
// exports.verifyOTP = (req, res) => {

//   try {
//     const { error } = otpSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//       return;
//     }
//     axios
//       .get(
//         "https://2factor.in/API/V1/ad542ca6-24b4-11ef-8b60-0200cd936042/SMS/VERIFY/" +
//         req.body.details +
//         "/" +
//         req.body.otp
//       )
//       .then(async (response) => {
//         if (response.data.Details === "OTP Matched") {
//           const isAlreadyRegistered = await User.findOne({
//             phone: req.body.phone,
//           }).lean();
//           if (isAlreadyRegistered) {
//             const _id = isAlreadyRegistered._id.toString();
//             const token = jwt.sign({ id: _id }, process.env.JWT_SER, {
//               expiresIn: "30d",
//             });
//             return res.status(200).send({
//               message: "Welcome back",
//               token: token,
//             });
//           }
//           const createParent = new User({
//             phone: req.body.phone,
//           });
//           createParent
//             .save()
//             .then(async (result) => {
//               const _id = result._id.toString();
//               const token = jwt.sign({ id: _id }, process.env.JWT_SER, {
//                 expiresIn: "30d",
//               });

//               return res.status(200).send({
//                 message: "Registered successful",
//                 token: token,
//               });
//             })
//             .catch((error) => {
//               console.log(error);
//               return res
//                 .status(500)
//                 .send({ message: "Something bad happened" });
//             });
//         } else if (response.data.Details === "OTP Expired") {
//           return res.status(403).send({ message: "OTP Expired" });
//         }
//       })
//       .catch((error) => {
//         return res.status(403).json({ message: "Invalid OTP" });
//       });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

exports.verifyOTP = async (req, res) => {
  try {
    const { error } = otpSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    if (req.body.phone === "9999999999" || req.body.phone === "8888888888") {
      const isAlreadyRegistered = await User.findOne({
        phone: req.body.phone,
      });
      if (isAlreadyRegistered) {
        const _id = isAlreadyRegistered._id.toString();
        const token = jwt.sign({ id: _id }, process.env.JWT_SER, {
          expiresIn: "30d",
        });
        return res.status(200).send({
          message: "Welcome back",
          token: token,
        });
      } else {
        const createParent = new User({
          phone: req.body.phone,
        });
        try {
          const result = await createParent.save();
          const _id = result._id.toString();
          const token = jwt.sign({ id: _id }, process.env.JWT_SER, {
            expiresIn: "30d",
          });
          return res.status(200).send({
            message: "Registered successful",
            token: token,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).send({ message: "Something bad happened" });
        }
      }
    }

    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/ad542ca6-24b4-11ef-8b60-0200cd936042/SMS/VERIFY/${req.body.details}/${req.body.otp}`
      );

      if (response.data.Details === "OTP Matched") {
        const isAlreadyRegistered = await User.findOne({
          phone: req.body.phone,
        });
        if (isAlreadyRegistered) {
          const _id = isAlreadyRegistered._id.toString();
          const token = jwt.sign({ id: _id }, process.env.JWT_SER, {
            expiresIn: "30d",
          });
          return res.status(200).send({
            message: "Welcome back",
            token: token,
          });
        } else {
          const createParent = new User({
            phone: req.body.phone,
          });
          try {
            const result = await createParent.save();
            const _id = result._id.toString();
            const token = jwt.sign({ id: _id }, process.env.JWT_SER, {
              expiresIn: "30d",
            });
            return res.status(200).send({
              message: "Registered successful",
              token: token,
            });
          } catch (e) {
            console.log(e);
            return res.status(500).send({ message: "Something bad happened" });
          }
        }
      } else if (response.data.Details === "OTP Expired") {
        return res.status(403).send({ message: "OTP Expired" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};




exports.registrationUser = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;
    const { error } = registrationUserSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const exist = await User.exists({ email: req.body.email });
    if (exist) {
      return res.status(400).json({ status: 0, message: "This email is already taken!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      userName,
      email,
      password: hashedPassword
    })
    const saveUserData = await newUser.save();
    res.status(200).json({ status: 1, message: "User registration is sucessfully" });

  } catch (error) {

    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }

}

exports.userLogin = async (req, res) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message)
    }
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });
    if (!user) {
      return res.status(400).json({ status: 0, message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ status: 0, message: 'Invalid credentials' });
    } else {
      const token = jwt.sign(
        {
          id: user._id
        },
        process.env.JWT_SER,
        { expiresIn: "30d" }
      );
      res.status(200).json({ status: 1, message: "User is login sucessfully", token });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};