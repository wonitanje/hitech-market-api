import { Schema, model } from 'mongoose'

const Body = new Schema({
  brand: String,
  name: String,
  description: String,
  price: Number,
  formFactor: String,
  image: String,
}, { versionKey: false })

export default model('Body', Body)