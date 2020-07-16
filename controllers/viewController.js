const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Booking = require('../model/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('pages/overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user',
  });

  const bookings = await Booking.find({ user: res.locals.user._id });
  const tourIDs = bookings.map((el) => el.tour.id);

  if (!tour) {
    next(new AppError('There is no such tour name.', 404));
  }

  res.status(200).render('pages/tour', {
    title: tour.name,
    tour,
    isBooked: tourIDs.includes(tour.id),
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('pages/login', {
    title: 'Log in to your account',
  });
};

exports.getRegisterForm = (req, res) => {
  res.status(200).render('pages/register', {
    title: 'Create an account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('pages/account', {
    title: 'Your account',
  });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // Find tours with returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('pages/overview', {
    title: 'My Tours',
    tours,
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successfully! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";

  next();
};
