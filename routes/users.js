const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', async(req, res) => {
  try {
    const { email, username, password } = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user, password)
    console.log(registeredUser)
    req.flash('success', 'Welcome to Yelp Camp!')
    res.redirect('/campgrounds')
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/register')
  }
})

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  req.flash('success', 'welcome back')
  res.redirect('/campgrounds')
})

router.get('/logout', (req, res) => {
  req.logout(function(error){
    if (error) {
      return next(error)
    }
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
  })
})

module.exports = router
