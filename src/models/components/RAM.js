const { Schema, model } = require('mongoose')

const RAM = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  connector: String,
  size: Number,
  frequency: Number,
})

module.exports = model('RAM', RAM)