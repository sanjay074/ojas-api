const express = require("express");
const router = express.Router();
const {verifyToken}= require("../../middlewares/auth");

const {registrationUser,userLogin} = require("../controllers/authController");
router.post("/signup", registrationUser);
router.post("/login", userLogin);


module.exports = router;
