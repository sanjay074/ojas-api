const express = require("express");
const router = express.Router();
const {postFabricItem,
    getFabricItem,
    deleteFabricItem,
    updateFabricItem,getFabricData,getOneFabric}=require("../controllers/fabricController");
const {verifyTokenAndAdmin} = require("../../middlewares/auth");    
const {upload} = require("../../middlewares/fileUpload");    

router.post('/addFabric',upload,verifyTokenAndAdmin,postFabricItem);
router.get('/getFabricItem',verifyTokenAndAdmin,getFabricItem);
router.delete('/deleteFabricItem/:id',verifyTokenAndAdmin,deleteFabricItem);
router.put('/updateFabricItem/:id',upload,verifyTokenAndAdmin,updateFabricItem);
router.get("/getFabricData",getFabricData);
router.get("/getOneFabric/:id",verifyTokenAndAdmin,getOneFabric);
module.exports=router