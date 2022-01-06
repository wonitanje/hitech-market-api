const { Schema, model } = require('mongoose')

const Storage = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  socket: String,
  size: Number,
  frequency: Number,
  type: String,
  cache: Number
})

module.exports = model('Storage', Storage)