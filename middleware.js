module.exports.isLoggedIn = (req, res, next) => {
  console.log('This is req.user:', req.user)
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first.')
    return res.redirect('/login')
  }
  next()
}

