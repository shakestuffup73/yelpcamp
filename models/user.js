const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // this sets up an index, it's not a validation
  }
})

// this will add a username, password field and additional methods
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)



