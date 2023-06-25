
const placeground = require('../models/placeground');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");

// const cloudinary = require('cloudinary');
// const multer = require('multer');
// const path = require('path');

// const  DataURI  = require('datauri/parser');
// const dUri = new DataURI();


// const storage = multer.memoryStorage();
// const upload = multer({ storage });

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

module.exports.renderRegister = (req, res) => {
    res.render('users/register');

}


//register Creat new User
module.exports.register = async (req, res, next) => {
//     try{


//       const newUser = new User(req.body.newUser);
//       newUser.image2 = req.files.map(f => ({ url: f.path, filename: f.filename }));

//     //   newUser.image2 = req.files.map(f => ({ url: f.path, filename: f.filename }))
//       const registeredUser = await User.register(newUser, req.body.password);
//        //eval(require('locus'))
//         if(req.body.adminCode === 'secretcode123'){
//             newUser.isAdmin = true;  
//         }
//       //console.log(registeredUser);
//       req.login(registeredUser, err => {    
//         if ( err ) return next(err);
//         req.flash('success','Welcome to 5star');
//         res.redirect('/5starplaces');
//       })
  
//     }catch (e) {
//       req.flash('error', e.message);
//       res.redirect('register');
//     }  
//   }

try {
    const { username, email, password, firstName, lastName} = req.body;
    const user = new User({ username : username , email: email, firstName: firstName, lastName: lastName});
    const rUser = await User.register(user , password);


    req.login(rUser, (err) =>{ // when a new person register we should automatically login 
        if(err) return next(err);
        req.flash('success' , "New user created!")
        res.redirect('/5starplaces');
    })
} catch (error) {
    req.flash('error' , error.message);
    res.redirect('/register');

}

}

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

//profile  
// module.exports.ShowProfile  = async (req, res) => {
//     try {
        
//     const foundUser = await User.findById(req.params.id);
    
//     const placegrounds = await placeground.find()
//         .where('author.id')
//         .equals(foundUser._id)
//         .exec();

//     // res.render('users/info', { user: foundUser, placegrounds });
//     res.render('users/info', { user: foundUser, placegrounds });

//     } catch (err) {
//     req.flash('error', 'Something went wrong...');
//     console.log('nooooooooooooooooooooooo')

//     res.redirect('/register');
    
//     }
// }
// USER PROFILE
 
module.exports.ShowProfile = async (req,res) => {
    try {
      const user = await User.findById(req.params.id);
      if(!user){
        req.flash("error", "User not found!")
        res.redirect("/5starplaces");
      }
      else{
        const placegrounds = await placeground.find({author : user._id})
        res.render('users/info', { author: user, placegrounds });
      }
    } catch (error) {
      req.flash("error", "User not found!")
      res.redirect("/5starplaces");
  
    }
  }
  

//Modifi Profile 
// module.exports.ModifyProfile = async (req, res) => {
//     try {
//       let newData = {};
//       const updateUser = await User.findById(req.params.id);
  
//       if (!req.file) {
//         newData = {
//           password: req.body.password,
//           email: req.body.email,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName
//         };
//       } else {
//         console.log('Hi');
//         const dataUri = req =>
//           dUri.format(
//             path.extname(req.file.originalname).toString(),
//             req.file.buffer
//           );
//         const file = dataUri(req).content;
//         const uploadImage = await cloudinary.uploader.upload(file);
//         await cloudinary.v2.uploader.destroy(updateUser.avatar.id);
  
//         newData = {
//           password: req.body.password,
//           email: req.body.email,
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           avatar: {
//             id: uploadImage.public_id,
//             url: uploadImage.secure_url
//           }
//         };
//       }
  
//       await updateUser.update({ $set: newData }).exec();
  
//       req.flash('success', 'Successfully Updated!');
//       res.redirect('/users/' + updateUser._id);
//     } catch (err) {
//       console.log(err.message);  
//       req.flash('error', 'Something went user wrong...');
//       res.redirect('/users/' + req.params.id);
//     }
//   }
//Edit Profile
// module.exports.EditProfile =  async (req, res) => {
//     try {
//       const foundUser = await new User.findById(req.params.id).exec();
//       if (foundUser._id.equals(req.user._id)) {
//         res.render('users/uedit', { user: foundUser });
//       } else {
//         req.flash('error', "You don't have permission to do that");
//         res.redirect('back');
//       }
//     } catch (err) {
//       req.flash('error', err.message);
//       res.redirect('back');
//     }
//   }
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