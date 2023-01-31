
const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');

}

module.exports.register = async (req, res, next) => {
    try{
      const { email, username, password } = req.body;
      const user = new User({email, username});
      const registeredUser = await User.register(user, password);
      //console.log(registeredUser);
      req.login(registeredUser, err => {
        if ( err ) return next(err);
        req.flash('success','Welcome to 5star');
        res.redirect('/5starplaces');
      })
  
    }catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }  
  }



module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login =  (req, res) => {
    req.flash("success", "User logged to 5star");
    const redirectUrl = req.session.returnTo || "/5starplaces";
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
  }

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