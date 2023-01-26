module.exports.isLoggedIn = (req, res, next) => {
  console.log('This is req.user:', req.user)
  if (!req.isAuthenticated()) {
    // store the url requesting, redirect back to login
    console.log('this is req.path:', req.path)
    req.session.returnTo = req.path
    req.flash('error', 'You must be signed in first.')
    return res.redirect('/login')
  }
  next()
}

