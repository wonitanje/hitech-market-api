import { Schema, model } from 'mongoose'

import Components from './components'

const componentsSchema = Object.fromEntries(Array.from(Object.keys(Components)).map((key) => [key, {
  name: String,
  image: String,
}]))

const Storage = new Schema(componentsSchema)

export default model('Catalog', Storage)