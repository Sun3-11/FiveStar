const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');
const multer = require('multer');
const {isLoggedIn,validateUser} = require('../middlewre');
const path = require('path');

// Multer لرفع الملفات
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage });

  //User Dashbord

// METHOD  : GET
// ROUTE   : /uDashbord
// FUNCTION: List all users
router.get('/uDashbord', catchAsync(users.AllUsers))

//register

// METHOD  : GET and POST
// ROUTE   : /register
// FUNCTION: Create a new user
router.route('/register')
    .get( users.renderRegister)
    .post(  upload.single('avatarSrc'),catchAsync(users.register) )


//Login

// METHOD  : GET and post 
// ROUTE   : /login
// FUNCTION: login
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
    .patch( upload.single('avatarSrc'), users.ModifyProfile)


//edit Profile
  // METHOD  : GET
  // ROUTE   : /users/:id/uedit
  // FUNCTION: Show the edit profile page

router.get('/users/:id/uedit', isLoggedIn,  users.EditProfile);


//logout
  // METHOD  : GET
  // ROUTE   : /logout
  // FUNCTION: logout
router.get('/logout', users.logout)


module.exports = router;