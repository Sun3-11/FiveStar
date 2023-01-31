const express = require('express');
const router = express.Router({mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } =require('../middlewre');
const Placeground = require('../models/placeground');
const Review = require ('../models/review');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.creatReview))
 
 router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

 module.exports = router;