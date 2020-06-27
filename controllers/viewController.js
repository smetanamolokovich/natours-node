const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

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
