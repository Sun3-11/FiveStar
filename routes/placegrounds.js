const express = require('express');
const router = express.Router();
const placeground = require('../controllers/placeground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validatePlaceground, isAuthor} = require('../middlewre');
const multer  = require('multer');
const {storage} = require('../cloudinary');
// const upload = multer({ dest: 'uploads/' });
const upload = multer({storage });

const Placeground = require('../models/placeground');

router.route('/')
    .get( catchAsync(placeground.index))
    .post( isLoggedIn, upload.array('image'), validatePlaceground, catchAsync(placeground.createPlaceground))
    //  .post((req, res) => {
    //     res.send(req.body)
    //  })

router.get('/new', isLoggedIn, placeground.renderNewForm);

router.route('/:id')
     .get(    catchAsync(placeground.showPlaceground))    
     .put(    isLoggedIn, isAuthor, upload.array('image'),  validatePlaceground, catchAsync(placeground.updatePlaceground))
     .delete( isLoggedIn, isAuthor, catchAsync( placeground.deletePlaceground))



router.get('/:id/edit', isLoggedIn, isAuthor,  catchAsync(placeground.renderEditForm));



module.exports = router;