const { placegroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Placeground = require('./models/placeground');
const Review = require('./models/review');

// Placses middelwre
module.exports.isLoggedIn = (req, res, next) => {
    //console.log("REQ>USER...", req.user)
    if (!req.isAuthenticated() || req.user.isAdmin) {
    // req.session.returnTo = req.originalUrl
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  
}
next();
}


module.exports.validatePlaceground = (req, res, next) => {
  const {error} = placegroundSchema.validate(req.body);
  if(error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
  
}


module.exports.isAuthor = async(req, res, next) =>{
  const { id } = req.params;
  const placeground = await Placeground.findById(id);
  if (!placeground.author.equals(req.user._id)) {
     // if (!placeground.author._id.equals(res.locals.currentUser._id)){
      req.flash('error', 'You no perrimtion to do that');
     return res.redirect(`/5starplaces/${id}`)
  }
  next();
}

//Reviews Middelwre

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}


module.exports.isReviewAuthor = async(req, res, next) =>{
  const {id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
     // if (!placeground.author._id.equals(res.locals.currentUser._id)){
      req.flash('error', 'You no perrimtion to do that');
     return res.redirect(`/5starplaces/${id}`)
  }
  next();
}

