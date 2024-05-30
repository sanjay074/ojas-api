const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin}= require("../../middlewares/auth");
const {addClass,getAllClass,updateClass,geOneClass} = require("../controllers/classController"); 

router.post("/addClass",verifyTokenAndAdmin,addClass);
router.get("/getAllClass",verifyTokenAndAdmin,getAllClass);
router.put("/updateClass/:id",verifyTokenAndAdmin,updateClass);
router.get("/geOneClass/:id",verifyTokenAndAdmin,geOneClass);

module.exports = router;
