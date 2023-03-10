const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const usStates = require('../utils/states.js')

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = async (req, res) => {
  console.log('this is usStates in renderNewForm', usStates )
  res.render('campgrounds/new', usStates);
}

module.exports.createCampground = async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send()

  console.log('this is geoData.body.features:', geoData.body.features[0].geometry.coordinates)

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry
  campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
  campground.author = req.user._id;

  await campground.save();

  console.log('this is campground!!!', campground)
  
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
          path: 'author',
        }
      }).populate('author')
      if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
      }
  console.log('this is campground.geometry.coordinates', campground.geometry.coordinates)
  console.log('this is inside the show controller')
  res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if (!campground) {
      req.flash('error', 'Cannot find that campground.')
      return res.redirect('/campgrounds')
    }
  if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that.');
      return res.redirect(`/campgrounds/${id}`);
  }
  console.log('!!!!! this is inside renderEditForm !!!!!')
  res.render('campgrounds/edit', { campground, usStates });
}

module.exports.searchCampgrounds = async (req, res) => {
  console.log('this is req.body.search in searchCampground controller', req.body.search)
  search = req.body.search
  foundCampgrounds = await Campground.find({"state": `${search}`})
  console.log('this is foundCampgrounds:', foundCampgrounds)
  if (foundCampgrounds.length > 0) {
    return res.render("campgrounds/search", {foundCampgrounds, search})
  } else {
    req.flash('error', 'No campgrounds found!')
    return res.redirect('/campgrounds')
  }
}

module.exports.updateCampground = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send()
  const { id } = req.params;
  console.log('this is req.body in updateCampground:', req.body)
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  campground.geometry = geoData.body.features[0].geometry
  const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
  campground.images.push(...imgs)
  await campground.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
    console.log('this is campground in updateCampground:', campground);
  }
  req.flash('success', 'Successfully updated campground.');
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground.')
  res.redirect('/campgrounds');
}

