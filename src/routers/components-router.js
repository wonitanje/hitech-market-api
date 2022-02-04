import { Router } from 'express'
import Components from '../models/components'

import Object from '../utils/Object'

const router = Router()

/**
 * @swagger
 * /api/stock/:
 *  get:
 *    description: Get entries from stock tables
 *    responses:
 *      200:
 *        description: Object of components tables
 */
router.get('/', async (req, res, next) => {
  const entries = Object.entriesArray(Components)

  const result = {}
  for (const [key, value] of entries) {
    const sql = await value.find({})
    result[key] = sql
  }

  res.status(200).send(result)
  next(false)
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
router.get('/:component', async (req, res, next) => {
  const { component } = req.params

  if (Components[component] == null) return res.status(404).send('Комплектующий не найден')

  const stock = await Components[component]?.find({})

  res.status(200).send(stock)
  next(false)
})

/**
 * @swagger
 * /api/stock/:component:
 *  post:
 *    description: Create new component
 *    produces:
 *      - application/json
 *    parameters:
 *      - :component: component name
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
router.post('/:component', async (req, res, next) => {
  const body = req.body
  const { component } = req.params

  if (Components[component] == null) return res.status(400)

  const stock = new Components[component](body)
  await stock.save()

  res.statusMessage = 'Success'
  res.sendStatus(201)
  next(false)
})

/**
 * @swagger
 * /api/stock/compatibility:
 *  get:
 *    description: Check components compatibility
 *    produces:
 *      - application/json
 *    parameters:
 *      - :componentName: Array of objects assign to [{ id - 1, amount - 1 }]
 *        in: body
 *        required: false
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The auto-generated id
 *          brand:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          price:
 *            type: number
 *          formFactor:
 *            type: string
 *    responses:
 *      200:
 *        description: Component created
 *      400:
 *        description: Object in array doesn't have id field
 *      404:
 *        description: ComponentName with this id not found
 *      422:
 *        description: Table of any componentName not found
 */
router.get('/compatibility', async (req, res, next) => {
  const components = {}
  const errors = {}

  for (const [component, payload] of Object.entriesArray(req.body)) {
    if (Components[component] == null)
      return res.status(422).send(`Комплектующий не найден ${components}`)

    for (const { id, amount = 1 } of payload) {
      if (id == null)
        return res.status(400).send(`Не найден id в нагрузке ${components}`)

      components[component] = []
      const sql = await Components[component].findById({ _id: id })
      if (sql == null) return res.status(404).send(`Неверный id ${components} ${id}`)
      components[component].push(Object.assign(sql, { amount }))
    }
  }

  if ((components.motherboard?.length || 0) == 1) {
    const board = components.motherboard[0]

    if ((components.cpu?.length || 0) === 1) {
      errors.soket = components.cpu[0].soket !== board.soket
    }

    if ((components.gpu?.length || 0) === 1) {
      errors.gpu = board.pci?.connector?.find(({ type }) => type === components.gpu[0].connector) == null
    }

    if ((components.body?.length || 0) === 1) {
      errors.formFactor = components.body[0].formFactor !== board.formFactor
    }

    if (components.ram) {
      const totalRamCapacity = components.ram.reduce((total, { size }) => total + size, 0)
      errors.ramCapacity = totalRamCapacity > board.ram.capacity
      errors.ramConnector = {}
      errors.ramAmount = {}

      components.ram.forEach((ram) => {
        const boardConnector = board.ram.connectors.find(({ type }) => type === ram.connector)
        errors.ramConnector[ram._id] = boardConnector == null
        if (boardConnector != null)
          errors.ramAmount[ram._id] = ram.amount > boardConnector?.amount
      })
    }

    if (components.storage) {
      errors.storageConnector = {}
      errors.storageAmount = {}

      components.storage.forEach((storage) => {
        const boardConnector = board.sata.find(({ type }) => type === storage.connector)
        errors.storageConnector[storage._id] = boardConnector == null
        if (boardConnector != null)
          errors.storageAmount[storage._id] = storage.amount > boardConnector?.amount
      })
    }
  }

  console.log(errors)
  if (errors) {
    return next(errors)
  }

  res.sendStatus(200)
  next(false)
})

export default router