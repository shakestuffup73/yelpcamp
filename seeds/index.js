const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelpcamp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database Connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 350; i++){
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 50) + 5
    const camp = new Campground({
      // YOUR USER ID
      author: '63d2b28f230b7269cb0921bb',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dgwexf22j/image/upload/v1675265787/YelpCamp/Not_All_Who_Wander_jl5qql.jpg',
          filename: 'YelpCamp/wvape760emvzotmhofwm'
        },
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, libero eos expedita deleniti aperiam assumenda ipsa possimus odit earum numquam. Saepe placeat ea repellat adipisci. Unde debitis laudantium optio corrupti.',
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      }
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})

