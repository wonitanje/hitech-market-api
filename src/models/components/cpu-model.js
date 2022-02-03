import { Schema, model } from 'mongoose'

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
  image: String,
  cache: {
    L1: Number,
    L2: Number,
    L3: Number,
  },

  soket: String,
  thermal: Number,
  power: Number,
}, { versionKey: false })

export default model('CPU', CPU)