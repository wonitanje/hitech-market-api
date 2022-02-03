import { Schema, model } from 'mongoose'

const Storage = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  connector: String,
  size: Number,
  frequency: Number,
  type: String,
  cache: Number,
  image: String,
}, { versionKey: false })

export default model('Storage', Storage)