const { string } = require('joi');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
//   email: {
//     type : String,
//     required: true,
//     unique: true
//   },
  isAdmin: {type: Boolean, default: false},
 username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
    unique: true
  },
  password: {
    type: String,
  },

  avatarSrc: String,


firstName: String,
  lastName: String,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);