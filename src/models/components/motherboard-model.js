import { Schema, model } from 'mongoose'

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
  image: String,

  cache: {
    L1: Number,
    L2: Number,
    L3: Number,
  },

  ram: {
    capacity: Number,
    connectors: [{
      type: String,
      amount: Number,
    }],
  },

  pci: {
    type: [{
      connector: String,
      amount: Number,
    }],
    default: [],
  },

  sata: {
    type: [{
      connector: String,
      amount: Number,
    }],
    default: [],
  },
}, { versionKey: false })

export default model('MotherBoard', MotherBoard)