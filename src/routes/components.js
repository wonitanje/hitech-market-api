import express from 'express'
import Stock from '../models/components'

import Object from '../utils/Object'

const router = express.Router()

/**
 * @swagger
 * /api/stock/:
 *  get:
 *    description: Get entries from stock tables
 *    responses:
 *      200:
 *        description: Object of components tables
 */
router.get('/', async (req, res) => {
  const entries = Object.entriesArray(Stock)

  const result = {}
  for (const [key, value] of entries) {
    const sql = await value.find({})
    result[key] = sql
  }

  res.status(200).send(result)
})

/**
 * @swagger
 * /api/stock/:component:
 *  get:
 *    description: Get entries from stock table
 *    parameters:
 *      - component: component name
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: An array of components
 */
router.get('/:component', async (req, res) => {
  const { component } = req.params

  if (Stock[component] == null) return res.status(404).send('Комплектующий не найден')

  const stock = await Stock[component].find({})

  res.status(200).send(stock)
})

/**
 * @swagger
 * /api/stock/:component:
 *  post:
 *    description: Create new component
 *    produces:
 *      - application/json
 *    parameters:
 *      - component: component name
 *        in: path
 *        required: true
 *        type: string
 *      - specs: specs of component
 *        in: body
 *        type: object
 *    responses:
 *      201:
 *        description: Component created 
 */
router.post('/:component', async (req, res) => {
  const body = req.body
  const { component } = req.params

  if (Stock[component] == null) return res.status(400)

  const stock = new Stock[component](body)
  await stock.save()

  res.statusMessage = 'Success'
  res.sendStatus(201)
})

export default router