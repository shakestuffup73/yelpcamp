const express = require ('express') 
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override')
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelpcamp')

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

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required,
      price: Joi.number.required().min(0)
    }).required()
  })
  const result = campgroundSchema.validate(req.body)
  console.log('this is result:', result)
  if (result.error){
    throw new ExpressError(result.error.details, 400)
  }
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

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


