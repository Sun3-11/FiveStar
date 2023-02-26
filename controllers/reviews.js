const Placeground = require('../models/placeground');
const Review = require ('../models/review');

module.exports.creatReview = async (req, res) => {
    // res.send('YOU MADE IT!!!!');
     const placeground = await Placeground.findById(req.params.id).populate(
    "reviews"
  );;
     const review = new Review(req.body.review);
     review.author = req.user._id;
     placeground.reviews.push(review);
    //calculate and update average rating
    placeground.rating = calculateAverage(placeground.reviews);
     await review.save();
     await placeground.save();
     req.flash('success', 'Created new review :)');
     res.redirect(`/5starplaces/${placeground._id}`);
 }
//deleting review
 module.exports.deleteReview = async (req, res) =>{
    const {id, reviewId} = req.params;
  //find by id and pull/delete reveiw from campground reviews array
    await Placeground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  // delete from reviews database
    await Review.findByIdAndDelete(reviewId);
    //recalculating and updating average rating
    const placeground = await Placeground.findById(req.params.id).populate(
        "reviews"
    );
  placeground.rating = calculateAverage(placeground.reviews);
  //save
  await placeground.save();
  //flash msg
    req.flash('success', 'Successfully deleted review :)');
    res.redirect(`/5starplaces/${id}`);
    //res.send("Delete me")
}


function calculateAverage(reviews) {
  if (reviews.length === 0) {
    return 0;
  }
  let sum = 0;
  reviews.forEach(function (element) {
    sum += element.rating;
  });
  let result = sum / reviews.length;
  return result.toFixed(2); //round to 2 decimal places
}