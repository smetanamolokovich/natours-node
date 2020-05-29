const mongoose = require('mongoose');
const validator = require('validator');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [
      100,
      "A user's name must have less than 100 characters",
    ],
    minlength: [10, "A user's name must have at least 10 characters"],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    // trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    // trim: true,
    minlength: [
      8,
      "A user's password must have at least 8 characters",
    ],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    trim: true,
  },
});

const User = mongoose.model('User', userScheme);

module.exports = User;
