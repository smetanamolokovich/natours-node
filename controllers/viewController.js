const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('pages/overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    {
      path: 'reviews',
      fields: 'review, rating, user',
    }
  );

  if (!tour) {
    next(new AppError('There is no such tour name.', 404));
  }

  res.status(200).render('pages/tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('pages/login', {
    title: 'Log in to your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('pages/account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  next();
});
