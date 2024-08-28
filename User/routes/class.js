const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin,verifyTokenAndUser}= require("../../middlewares/auth");
const {addClass,getAllClass,updateClass,getOneClass,getAllClassByCourseId,deleteClassList} = require("../controllers/classController"); 

router.post("/addClass",verifyTokenAndAdmin,addClass);
router.get("/getAllClass",verifyTokenAndAdmin,getAllClass);
router.put("/updateClass/:id",verifyTokenAndAdmin,updateClass);
router.get("/getOneClass/:id",verifyTokenAndAdmin,getOneClass);
router.get("/classes/:courseId",getAllClassByCourseId);
router.delete('/deleteClassList/:id', verifyTokenAndAdmin,deleteClassList);

module.exports = router;
