import { Schema, model } from 'mongoose'

const PowerSupply = new Schema({
  brand: String,
  name: String,
  model: String,
  description: String,
  price: Number,
  power: Number,
  connectors: {
    type: [{
      name: String,
      amount: Number,
    }],
    default: [],
  },
  image: String,
}, { versionKey: false })

export default model('PowerSupply', PowerSupply)