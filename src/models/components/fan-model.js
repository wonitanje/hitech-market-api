import { Schema, model } from 'mongoose'

const Fan = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  size: Number,
  image: String,
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
}, { versionKey: false })

export default model('Fan', Fan)