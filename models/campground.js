const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
  url: String,
  filename: String,
})

ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_150')
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  state: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  let miniImage = null
  if (this.images.length){
    miniImage = this.images[0].thumbnail
  } else {
    miniImage = "https://res.cloudinary.com/dgwexf22j/image/upload/w_50/v1675265787/YelpCamp/Not_All_Who_Wander_jl5qql.jpg"
  }
  return `<div style="text-align:center;"><strong><a href="/campgrounds/${this._id}">${this.title}</a></strong></br>
  <img src="${miniImage}" width="70"><div>`
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)

// https://source.unsplash.com/collection/483251/1600x900