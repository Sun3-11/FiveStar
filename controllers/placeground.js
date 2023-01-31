const Placeground = require('../models/placeground');

module.exports.index = async(req, res) => {
    const fivestarplaces = await Placeground.find({});
    res.render('5starplaces/index', {fivestarplaces})
}

module.exports.renderNewForm =  (req, res) => { 
    res.render('5starplaces/new');
}

module.exports.createPlaceground =async(req, res, next) => {
    //  if(!req.body.placeground) throw new ExpressError('Invalid places Data', 400)
      const placeground = new Placeground(req.body.placeground);
      placeground.author = req.user._id;
      await placeground.save();
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
    res.render('5starplaces/show', { placeground });
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const placeground = await Placeground.findById(id); 
    if(!placeground){
        req.flash('error', 'Cannot find that place :(');
       return res.redirect('/5starplaces');
    }
    res.render('5starplaces/edit', { placeground });
}

module.exports.updatePlaceground = async (req, res) => {
    // res.send("IT WOEKED!!!")
    const { id } = req.params;
    const placeground = await Placeground.findByIdAndUpdate(id, { ...req.body.placeground });
    req.flash('success', 'Successfully updated :)');
    res.redirect(`/5starplaces/${placeground._id}`);
}

module.exports.deletePlaceground = async(req, res) => {
    const { id } = req.params;
    await Placeground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted place :)');
    res.redirect('/5starplaces');
}