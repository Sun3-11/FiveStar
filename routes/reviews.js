const express = require('express');
const router = express.Router({mergeParams: true });

const Placeground = require('../models/placeground');
const Review = require ('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas.js');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    // res.send('YOU MADE IT!!!!');
     const placeground = await Placeground.findById(req.params.id);
     const review = new Review(req.body.review);
     placeground.reviews.push(review);
     await review.save();
     await placeground.save();
     req.flash('success', 'Created new review :)');
     res.redirect(`/5starplaces/${placeground._id}`);
 }))
 
 router.delete('/:reviewId', catchAsync(async (req, res) =>{
     const {id, reviewId} = req.params;
     await Placeground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
     await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'Successfully deleted review :)');
     res.redirect(`/5starplaces/${id}`);
     //res.send("Delete me")
 }))

 module.exports = router;