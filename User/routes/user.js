const express = require("express");
const router = express.Router();
const {verifyToken,verifyTokenAndUser}= require("../../middlewares/auth");
const {upload}= require("../../middlewares/fileUpload");
const {registrationUser,userLogin,phoneLogin,verifyOTP} = require("../controllers/authController");
const {userUpdateProfile,getUserData,DeleteUser,profileImageUpload} = require("../controllers/userController");
router.post("/signup", registrationUser);
router.post("/login", userLogin);
router.post("/phoneLogin",phoneLogin);
router.post("/verifyOTP",verifyOTP);
router.put("/userUpdateProfile",verifyTokenAndUser,userUpdateProfile);
router.get('/getUserData',getUserData)
router.delete('/DeleteUser/:id',DeleteUser)

router.put("/profileImageUpload",verifyTokenAndUser,upload,profileImageUpload);

module.exports = router;
