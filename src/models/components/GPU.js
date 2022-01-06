const { Schema, model } = require('mongoose')

const GPU = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  chipset: Number,
  price: Number,
  RAM: {
    socket: String,
    size: Number,
    frequency: Number,
  },

  connector: String,
  thermal: Number,
  power: {
    connectors: [{
      type: String,
      amount: Number,
    }],
    input: Number,
  },
})

module.exports = model('GPU', GPU)