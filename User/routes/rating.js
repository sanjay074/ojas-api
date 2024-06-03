const express = require("express");
const router = express.Router();
const {verifyToken}= require("../../middlewares/auth");
const {userRating,getCouresAverageRating}= require("../controllers/ratingController");
router.post("/addReview",verifyToken,userRating);
router.get("/average/:id",verifyToken,getCouresAverageRating);

module.exports = router;