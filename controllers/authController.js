const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // HTTPS only
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = newUser.createEmailValidationToken();
  const url = `${req.protocol}://${req.get('host')}/me/confirm-email/${token}`;
  await new Email(newUser, url).sendWelcome();

  newUser.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser
    }
  })
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and pswd exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // If everything ok, send token to client
  createAndSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not loged in. Please log in to get an access!', 401)
    );

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token no longer exist.', 401)
    );
  }

  // Check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // Check if user changed password after the JWT was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a loggen in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with this email address.`, 404));
  }

  // Generate the random reset

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later')
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // Update changedPasswordAt property for the user
  // Log the user in, send JWT
  createAndSendToken(user, 200, req, res);
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
      emailValidationToken: hashedToken,
      emailValidationExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
  
    user.active = true;
    user.emailValidationToken = undefined;
    user.emailValidationExpires = undefined;
  
    await user.save({validateBeforeSave: false});
    createAndSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // Check if POSTed current password is correct

  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your password is wrong. Please, try again', 401));
  }

  // If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  // Log user in, send JWT
  createAndSendToken(user, 200, req, res);
});
