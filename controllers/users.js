
const placeground = require('../models/placeground');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");
const fs = require('fs');
const path = require('path');


//All Users
module.exports.AllUsers =async (req, res) => {
    try {
    const users = await User.find({});

    res.render('users/index', {
        users: users,
        page: 'users'
    });
    } catch (err) {}
};

//Render Register
module.exports.renderRegister = (req, res) => {
    res.render('users/register');

}

//register Creat new User
module.exports.register = async (req, res, next) => {
    try {
        const avatarPath = req.file.filename;
        const { username, email, password, firstName, lastName} = req.body;
        const user = new User({ username : username , email: email, firstName: firstName, lastName: lastName, avatarSrc: avatarPath});
        const rUser = await User.register( user , password);
    
    
        req.login(rUser, (err) =>{ // when a new person register we should automatically login 
            if(err) return next(err);
            req.flash('success', 'Welcome to fiveStar ' + user.username + '!');
            res.redirect('/5starplaces');
        })
    } catch (error) {
        req.flash('error' , error.message);
        res.redirect('/register');
    
    }
}

//Render login
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//login
module.exports.login =  (req, res) => {
    req.flash("success", "User logged to 5star");
    const redirectUrl = req.session.returnTo || "/5starplaces";
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}


// USER Show Profile PROFILE

module.exports.ShowProfile = async (req,res) => {
    try {
    const user = await User.findById(req.params.id);
    
    const avatarFilename = user.avatarSrc;
    const avatarPath = `/uploads/${avatarFilename}`;
    if(!user){
        req.flash("error", "User not found!")
        res.redirect("/5starplaces");
    }
    else{
        const placegrounds = await placeground.find({author : user._id})
        res.render('users/info', { avatarUrl: avatarPath ,author: user, placegrounds });
    }
    } catch (error) {
    req.flash("error", "User nottttt found!")
    res.redirect("/5starplaces");

    }
}

//User Modify Profile
module.exports.ModifyProfile = async (req, res) => {
    try {
        let newData = {};

        const updateUser = await User.findById(req.params.id);

        if (!req.file) {
        newData = {
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        } else {
          // حذف الصورة السابقة إذا المستخدم حمل صورة جديدة
        if (updateUser.avatarSrc) {
            //    حذف الصورة السابقة من المجلد "uploads"
            fs.unlinkSync( path.join(__dirname, '..', '/public/uploads', updateUser.avatarSrc));
        }
    
        newData = {
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatarSrc: req.file.filename,
        };
        }
    
        const updatedUser = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        });
        // await updateUser.updateOne({ $set: newData }).exec();
        req.flash('success', 'تم التحديث بنجاح!');
        res.redirect('/users/' + updateUser._id);
    } catch (err) {
        console.log(err.message);
        req.flash('error', 'حدث خطأ ما...');
        res.redirect('/users/' + req.params.id);
    }
    };
    
    // Edit Profile       
    module.exports.EditProfile = async (req, res) => { 
    try {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    
    if (foundUser._id.equals(req.user._id)) {
    res.render('users/uedit', { user: foundUser });
    } else {
    req.flash('error', 'ليس لديك الصلاحية لفعل ذلك');
    res.redirect('back');
    }
    } catch (err) {
    req.flash('error', err.message);
    res.redirect('back');
    }
};

  //logout
module.exports.logout  = (req, res) => {
    //req.logout();
    // req.flash('success', "Goodbye!");
    // res.redirect('/5starplaces');

    req.logout(req.user, err => {
    if(err) return next(err);
    req.flash('success', "Goodbye!");
    res.redirect("/5starplaces");
    })
}