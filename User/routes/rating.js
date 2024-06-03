const express = require("express");
const router = express.Router();
const {verifyToken}= require("../../middlewares/auth");
const {userRating,getCouresAverageRating,userUpadteRating}= require("../controllers/ratingController");
router.post("/addReview",verifyToken,userRating);
router.get("/average/:id",verifyToken,getCouresAverageRating);
router.put("/upadteRating/:id",verifyToken,userUpadteRating);

module.exports = router;