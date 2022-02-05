import { Schema, model } from 'mongoose'

const GPU = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  chipset: String,
  price: Number,
  image: String,

  RAM: {
    socket: String,
    size: Number,
    frequency: Number,
  },

  connector: String,
  thermal: Number,
  power: {
    connectors: {
      type: [{
        type: String,
        amount: Number,
      }],
      default: [],
    },
    input: Number,
  },
}, { versionKey: false })

export default model('GPU', GPU)