const { Schema, model } = require('mongoose')

const Fan = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  size: Number,
  noise: {
    min: Number,
    max: Number,
  },
  RPM: {
    min: Number,
    max: Number,
  },
  connector: String,
  power: Number,
  sockets: [String],
})

module.exports = model('Fan', Fan)