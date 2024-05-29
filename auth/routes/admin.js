const express = require("express");
const router = express.Router();
const {verifyToken, verifyTokenAndAdmin}= require("../../middlewares/auth");

const {registrationUser,asminUserLogin} = require("../controllers/adminController");

router.post("/adminSignup", verifyTokenAndAdmin,registrationUser);
router.post("/adminLogin", asminUserLogin);

module.exports = router;