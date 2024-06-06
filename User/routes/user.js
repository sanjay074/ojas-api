const express = require("express");
const router = express.Router();
const {verifyToken}= require("../../middlewares/auth");

const {registrationUser,userLogin,loginWithPhone} = require("../controllers/authController");
router.post("/signup", registrationUser);
router.post("/login", userLogin);
router.post("/send-otp", loginWithPhone);


module.exports = router;
