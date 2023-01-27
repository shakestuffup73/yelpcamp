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
    console.log('this is registeredUser:', registeredUser)
    req.login(registeredUser, error =>{
      if (error) return next(error)
      req.flash('success', 'Welcome to Yelp Camp!')
      res.redirect('/campgrounds')
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/register')
  }
})

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
  req.flash('success', 'welcome back')
  // if there's a redirectURL, it will go to that, if not, it will default to redirecting to '/campgrounds'
  const redirectURL = req.session.returnTo || '/campgrounds'
  console.log('this is redirectURL', redirectURL)
  console.log('this is req.session.returnTo', req.session.returnTo)
  res.redirect(redirectURL)
  delete req.session.returnTo
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
