const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { placegroundSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const Placeground = require('../models/placeground');



const validatePlaceground = (req, res, next) => {
    const {error} = placegroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}


router.get('/', catchAsync(async(req, res) => {
    const fivestarplaces = await Placeground.find({});
    res.render('5starplaces/index', {fivestarplaces})
}));


router.get('/new', (req, res) => {
   
    res.render('5starplaces/new');
});

router.post('/', validatePlaceground, catchAsync(async(req, res, next) => {
      //  if(!req.body.placeground) throw new ExpressError('Invalid places Data', 400)
        const placeground = new Placeground(req.body.placeground);
        await placeground.save();
        req.flash('success', 'Successfully made a new 5star place')

        res.redirect(`/5starplaces/${placeground._id}`);
   
}));


router.get('/:id',catchAsync(async(req, res) => {
    const placeground = await Placeground.findById(req.params.id).populate('reviews');
    //console.log(placeground)
    if(!placeground){
        req.flash('error', 'Cannot find that place :(');
       return res.redirect('/5starplaces');
    }
    res.render('5starplaces/show', { placeground });
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const placeground = await Placeground.findById(req.params.id);
    if(!placeground){
        req.flash('error', 'Cannot find that place :(');
       return res.redirect('/5starplaces');
    }
    res.render('5starplaces/edit', { placeground });
}));

router.put('/:id', validatePlaceground, catchAsync(async (req, res) => {
    // res.send("IT WOEKED!!!")
    const { id } = req.params;
    const placeground = await Placeground.findByIdAndUpdate(id, { ...req.body.placeground });
    req.flash('success', 'Successfully updated :)');
    res.redirect(`/5starplaces/${placeground._id}`);
}));

router.delete('/:id', catchAsync( async(req, res) => {
    const { id } = req.params;
    await Placeground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted place :)');
    res.redirect('/5starplaces');
}));

module.exports = router;