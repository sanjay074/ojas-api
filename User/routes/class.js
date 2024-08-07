const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin,verifyTokenAndUser}= require("../../middlewares/auth");
const {addClass,getAllClass,updateClass,geOneClass,getAllClassByCourseId} = require("../controllers/classController"); 

router.post("/addClass",verifyTokenAndAdmin,addClass);
router.get("/getAllClass",verifyTokenAndAdmin,getAllClass);
router.put("/updateClass/:id",verifyTokenAndAdmin,updateClass);
router.get("/geOneClass/:id",verifyTokenAndAdmin,geOneClass);
router.get("/classes/:courseId",getAllClassByCourseId);

module.exports = router;
