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
  for (let i = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 50) + 5
    const camp = new Campground({
      author: '63d2b28f230b7269cb0921bb',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251/350x250',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, libero eos expedita deleniti aperiam assumenda ipsa possimus odit earum numquam. Saepe placeat ea repellat adipisci. Unde debitis laudantium optio corrupti.',
      price: price,
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})

