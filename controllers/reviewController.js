const Review = require('../model/reviewModel');
const Booking = require('../model/bookingModel');
const factory = require('./handleFactory');
const AppError = require('../utils/AppError');

exports.setTourAndReviewIDs = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.isTourBooked = async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour.id);
  if (!tourIDs.includes(req.params.tourID)) {
    return next(new AppError('To review user must book current tour.', 403));
  }

  next();
};

exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
