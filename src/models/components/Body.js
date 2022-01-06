const { Schema, model } = require('mongoose')

const Body = new Schema({
  brand: String,
  name: String,
  description: String,
  price: Number,
  formFactor: String,
})

module.exports = model('Body', Body)