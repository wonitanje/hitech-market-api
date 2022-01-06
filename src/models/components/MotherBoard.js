const { Schema, model } = require('mongoose')

const MotherBoard = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  chipset: String,
  formFactor: String,
  soket: String,
  thermal: Number,
  power: Number,

  cache: {
    L1: Number,
    L2: Number,
    L3: Number,
  },

  RAM: {
    capacity: Number,
    connector: [{
      type: String,
      amount: Number,
    }],
  },

  PCI: [{
    connector: String,
    amount: Number,
  }],

  SATA: [{
    connector: String,
    amount: Number,
  }],
})

module.exports = model('MotherBoard', MotherBoard)