const express = require ('express') 
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database Connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))

// MOUNTED ROUTERS
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res) => {
  res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!', 404))
})

// 404 & other handling middleware at the end of the file if routes are not found
app.use((error, req, res, next) => {
  const { statusCode = 500 } = error
  if(!error.message) error.message = 'Oh no, something went wrong!'
  res.status(statusCode).render('error', { error })
})

app.listen(3000, () => {
  console.log('Listening on Port 3000!')
})


