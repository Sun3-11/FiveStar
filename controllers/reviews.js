const Placeground = require('../models/placeground');
const Review = require ('../models/review');

module.exports.creatReview = async (req, res) => {
    // res.send('YOU MADE IT!!!!');
     const placeground = await Placeground.findById(req.params.id);
     const review = new Review(req.body.review);
     review.author = req.user._id;
     placeground.reviews.push(review);
     await review.save();
     await placeground.save();
     req.flash('success', 'Created new review :)');
     res.redirect(`/5starplaces/${placeground._id}`);
 }

 module.exports.deleteReview = async (req, res) =>{
    const {id, reviewId} = req.params;
    await Placeground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review :)');
    res.redirect(`/5starplaces/${id}`);
    //res.send("Delete me")
}