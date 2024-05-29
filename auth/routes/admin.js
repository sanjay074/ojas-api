const express = require("express");
const router = express.Router();
const {verifyToken, verifyTokenAndAdmin}= require("../../middlewares/auth");

const {registrationUser,asminUserLogin,getAllUser,searchOneUser} = require("../controllers/adminController");

router.post("/adminSignup",registrationUser);
router.post("/adminLogin", asminUserLogin);
router.get("/getAllUser",verifyTokenAndAdmin,getAllUser);
router.get("/searchUser/:key",verifyTokenAndAdmin,searchOneUser);
module.exports = router;