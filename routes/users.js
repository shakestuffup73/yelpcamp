const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')

router.route('/register')
  .get('/register', users.renderRegister)
  .post('/register', catchAsync(users.register))

router.route('/login')
  .get('/login', users.renderLogin)
  .post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)

router.get('/logout', users.logout)

module.exports = router
