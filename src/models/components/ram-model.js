import { Schema, model } from 'mongoose'

const RAM = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  connector: String,
  size: Number,
  frequency: Number,
  image: String,
}, { versionKey: false })

export default model('RAM', RAM)