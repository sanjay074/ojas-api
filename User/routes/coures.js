const express = require("express");
const router = express.Router();
const {verifyTokenAndAdmin}= require("../../middlewares/auth");

const {addCoures,getAllCoures,getOneCoures,deleteCoures,updateCoures,getAllFreeCoures,getAllpaidCoures} = require("../controllers/couresController");

router.post("/addCouress",verifyTokenAndAdmin,addCoures);
router.get("/getAllCouress",verifyTokenAndAdmin,getAllCoures);
router.get("/getOneCouress/:id",verifyTokenAndAdmin,getOneCoures);
router.delete("/deleteCoures/:id",verifyTokenAndAdmin,deleteCoures);
router.put("/updateCoures/:id",verifyTokenAndAdmin,updateCoures);
router.get("/getAllFreeCoures",getAllFreeCoures);
router.get("/getPaidCoures",getAllpaidCoures);
module.exports = router;