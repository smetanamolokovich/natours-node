const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Booking = require('../model/bookingModel');
const Review = require('../model/reviewModel');

exports.getPathName = (req, res, next) => {
  res.locals.pathname = req.originalUrl;

  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('pages/overview', {
    title: 'All tours',
    tours,
  });
});

exports.getEmailConfirm = catchAsync(async (req, res, next) => {
  res.status(200).render('pages/email-confirm', {
    title: 'Email Confirmed!',
    emailToken: req.params.token
  });
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user',
  });

  let tourIDs;
  let reviewedTourIDs;
  let isBooked;
  let isReviewed;
  if (res.locals.user) {
    const bookings = await Booking.find({ user: res.locals.user._id });
    tourIDs = bookings.map((el) => el.tour.id);
    isBooked = tourIDs.includes(tour.id);

    const reviews = await Review.find({ user: res.locals.user._id }).populate(
      'tour'
    );
    reviewedTourIDs = reviews.map((el) => el.tour.id);
    isReviewed = reviewedTourIDs.includes(tour.id);
  }
  if (!tour) {
    next(new AppError('There is no such tour name.', 404));
  }

  res.status(200).render('pages/tour', {
    title: tour.name,
    tour,
    isBooked,
    isReviewed,
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
  res.status(200).render('pages/admin/settings', {
    title: 'Your account',
  });
};

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name',
  });

  res.status(200).render('pages/admin/reviews', {
    title: 'My reviews',
    reviews,
  });
});

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
