const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');
// const multer = require('multer');
const {isLoggedIn} = require('../middlewre');

// const {storage} = require('../cloudinary');
// const upload = multer({ dest: 'uploads/' });
// const upload = multer({storage });
const multer  = require('multer');
const {storage} = require('../cloudinary');
// const upload = multer({ dest: 'uploads/' });
const upload = multer({storage });

router.get('/UDashbord', catchAsync(users.AllUsers))
//register
router.route('/register')
    .get( users.renderRegister)
    .post( catchAsync( users.register) )

//login
router.route('/login')
    .get( users.renderLogin)
    .post(
       
        passport.authenticate("local", {
          failureFlash: true,
          failureRedirect: "/login",
          failureMessage: true,
          keepSessionInfo: true,
        }),
      users.login
      )

//Profile

// METHOD  : GET and PATCH 
// ROUTE   : /users/:id
// FUNCTION: Show information page and Modify
router.route('/users/:id')
    .get(  users.ShowProfile)
    // .patch( users.ModifyProfile )
  
    // router.get("/users/:id",

  
  // METHOD  : GET
  // ROUTE   : /users/:id/edit
  // FUNCTION: Show the edit profile page

// router.get('/user/:id/uedit', isLoggedIn,  users.EditProfile);

router.get('/logout', users.logout)


module.exports = router;