const Rating = require("../models/rating");
const { ratingSchema, upadteRatingSchema } = require("../../validators/authValidator");
const mongoose = require("mongoose");

// Add a new rating
exports.userRating = async (req, res) => {
    try {
        const { error } = ratingSchema.validate(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        const { courseId, userId, rating, review } = req.body;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid course ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user Id" });
        }
        const existingRating = await Rating.findOne({
            courseId: req.body.courseId,
            userId: req.body.userId
        });
        if (existingRating) {
            return res.status(400).json({ success: false, message: 'User has already rated this course' });
        }
        const addRating = new Rating({
            courseId, userId, rating, review
        })
        const saveRating = await addRating.save();
        return res.status(201).json({ success: true, message: "User add rating sucessfully" })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
}


// Get average rating for a course
exports.getCouresAverageRating = async (req, res) => {
    try {
        const courseId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid course ID" });
        }
        const ratings = await Rating.find({ courseId });
        const average = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
        return res.status(200).json({ success: true, message: "Get average rating for a course", average })

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
}


//User upadte rating api
exports.userUpadteRating = async (req, res) => {
    const { error } = upadteRatingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const ratingId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(400).json({ success: false, message: "Rating not found" })
        }
        rating.rating = req.body.rating;
        rating.review = req.body.review;
        const updatedRating = await rating.save();
        return res.status(200).json({ success: true, message: "User update rating api sucessfully" })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }

}

