const { Schema, model } = require('mongoose')

const PowerSupply = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  power: Number,
  connectors: [{
    name: String,
    amount: Number,
  }],
})

module.exports = model('PowerSupply', PowerSupply)