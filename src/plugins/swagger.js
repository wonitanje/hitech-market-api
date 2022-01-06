import express from 'express'
import swagger from 'swagger-ui-express'
import swaggerJS from 'swagger-jsdoc'

const router = express.Router()

const options = {
  definition: {
    info: {
      title: "Hitech Market",
      description: "This a simple api for market",
      servers: ['localhost:3000'],
      version: "0.0.1",
    },
  },
  apis: ['src/routes/**/*.js'],
}

const swaggerSpecs = swaggerJS(options)

router.use(swagger.serve)
router.get('/', swagger.setup(swaggerSpecs))

export default router