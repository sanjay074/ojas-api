
const express = require("express");
const router = express.Router();
const {postFabricItem,
    getFabricItem,
    deleteFabricItem,
    updateFabricItem,}=require("../controllers/fabricController")

router.post('/postFabricItem',postFabricItem)
router.get('/getFabricItem',getFabricItem)
router.delete('/deleteFabricItem/:id',deleteFabricItem)
router.put('/updateFabricItem/:id',updateFabricItem)
module.exports=router