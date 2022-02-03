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

/*
  @swagger
    components:
      schemas:
        Body:
          type: object
          properties:
            _id:
              type: string
              description: The auto-generated id
            brand:
              type: string
            name:
              type: string
            description:
              type: string
            price:
              type: number
            formFactor:
              type: string
*/