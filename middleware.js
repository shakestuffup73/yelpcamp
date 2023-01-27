const { campgroundSchema } = require('../schemas.js');
const ExpressError = require('./utils/ExpressError')
const Campground = require('../models/campground')

module.exports.isLoggedIn = (req, res, next) => {
  console.log('This is req.user:', req.user)
  if (!req.isAuthenticated()) {
    // store the url requesting, redirect back to login
    console.log('this is req.originalUrl:', req.originalUrl)
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first.')
    return res.redirect('/login')
  }
  next()
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that.')
      return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el =>
      el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}