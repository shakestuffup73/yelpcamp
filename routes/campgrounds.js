const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage }) 

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

router.get('/', catchAsync(campgrounds.index))

router.post('/', isLoggedIn,  upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// router.post('/', upload.array('image'), (req, res) => {
//   console.log('this is image post req.body:', req.body)
//   console.log('this is image post req.files', req.files)
//   res.send('Did it work? YAS QUEEN!')
// })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', catchAsync(campgrounds.showCampground))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm))

module.exports = router