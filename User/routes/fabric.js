const express = require("express");
const router = express.Router();
const {postFabricItem,
    getFabricItem,
    deleteFabricItem,
    updateFabricItem,}=require("../controllers/fabricController")
const {verifyTokenAndAdmin} = require("../../middlewares/auth");    
const {upload} = require("../../middlewares/fileUpload");    

router.post('/addFabric',upload,postFabricItem)
router.get('/getFabricItem',getFabricItem)
router.delete('/deleteFabricItem/:id',deleteFabricItem)
router.put('/updateFabricItem/:id',updateFabricItem)
module.exports=router