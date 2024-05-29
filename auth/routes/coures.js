const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin}= require("../../middlewares/auth");

const {addCoures,getAllCoures,getOneCoures,deleteCoures} = require("../controllers/couresController");

router.post("/addCouress",verifyTokenAndAdmin,addCoures);
router.get("/getAllCouress",verifyTokenAndAdmin,getAllCoures);
router.get("/getOneCouress/:id",verifyTokenAndAdmin,getOneCoures);
router.delete("/deleteCoures/:id",verifyTokenAndAdmin,deleteCoures);
module.exports = router;