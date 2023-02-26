const Placeground = require('../models/placeground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const { cloudinary } = require("../cloudinary");

module.exports.index = async(req, res) => {
  // const fivestarplaces = await Placeground.find({});
    
// if search
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const fivestarplaces = await populatePlace(
      Placeground.find({
        $or: [{ title: regex }, { location: regex }],
      })
    );
    if (fivestarplaces.length < 1) {
      req.flash("error", "No campgrounds found, please try again.");
      return res.redirect("/5starplaces");
    }
    res.render('5starplaces/index', { fivestarplaces });
    // sorting highest rated
  } else if (req.query.sortby === "higestRated") {
    const fivestarplaces = await populatePlace(
      Placeground.find({}).sort({ rating: -1 })
    );
    res.render('5starplaces/index', { fivestarplaces });
    //sorting lowest price
  } else if (req.query.sortby === "lowestPrice") {
    const fivestarplaces = await populatePlace(
      Placeground.find({}).sort({ price: 1 })
    );
    res.render('5starplaces/index', { fivestarplaces });
    //sorting highest price
  } else if (req.query.sortby === "highestPrice") {
    const fivestarplaces = await populatePlace(
      Placeground.find({}).sort({ price: -1 })
    );
    res.render('5starplaces/index', { fivestarplaces });
    //clear sorting or no query
  } else if (req.query.sortby === "clear" || !req.query.sortby) {
    const fivestarplaces = await populatePlace(Placeground.find({}));
    res.render('5starplaces/index', { fivestarplaces });
    //find by tag
  } else {
    const fivestarplaces = await populatePlace(
      Placeground.find({
        tag: { $in: [req.query.sortby] },
      })
    );
    res.render('5starplaces/index', {fivestarplaces,typeplacees })
}

}

const typeplacees = ['fruit', 'vegetable', 'dairy'];
const duration = ['24', '12', 'day', 'month', 'year'];


module.exports.renderNewForm = async (req, res) => { 
 
    res.render('5starplaces/new', { typeplacees, duration});
}

module.exports.createPlaceground =async(req, res, next) => {
    //  if(!req.body.placeground) throw new ExpressError('Invalid places Data', 400)
     const geoData = await geocoder.forwardGeocode({
         query: req.body.placeground.location,
         limit: 1
      }).send() 
     
      //res.send('Ok!')
      const placeground = new Placeground(req.body.placeground);
      placeground.geometry= geoData.body.features[0].geometry;
      placeground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
      placeground.author = req.user._id;
      await placeground.save();
      console.log(placeground)
      req.flash('success', 'Successfully made a new 5star place')
      res.redirect(`/5starplaces/${placeground._id}`);
      
}


module.exports.showPlaceground = async(req, res) => {
    const placeground = await Placeground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    
    }).populate('author');
    //console.log(placeground)
    if(!placeground){
        req.flash('error', 'Cannot find that place :(');
       return res.redirect('/5starplaces');
    }
    res.render('5starplaces/show', { placeground, typeplacees, duration });
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const placeground = await Placeground.findById(id); 
    if(!placeground){
        req.flash('error', 'Cannot find that place :(');
       return res.redirect('/5starplaces');
    }
    res.render('5starplaces/edit', { placeground, typeplacees, duration });
}

module.exports.updatePlaceground = async (req, res) => {
    // res.send("IT WOEKED!!!")
    const { id } = req.params;
    const placeground = await Placeground.findByIdAndUpdate(id, { ...req.body.placeground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    placeground.image.push(...imgs);
    await placeground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await placeground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated :)');
    res.redirect(`/5starplaces/${placeground._id}`);
}

module.exports.deletePlaceground = async(req, res) => {
    const { id } = req.params;
    await Placeground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted place :)');
    res.redirect('/5starplaces');
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function populatePlace(placeground) {
  return placeground
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
}
