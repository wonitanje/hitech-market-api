const { Schema, model } = require('mongoose')

const CPU = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  cores: Number,
  threads: Number,
  frequency: Number,
  bitness: Number,
  cache: {
    L1: Number,
    L2: Number,
    L3: Number,
  },

  soket: String,
  thermal: Number,
  power: Number,
})

module.exports = model('CPU', CPU)