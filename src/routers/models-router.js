import express from 'express'
import Components from '../models/components'

import Object from '../utils/Object'

const router = express.Router()
const Models = Components

router.get('/', async (req, res, next) => {
  const entries = Object.entriesArray(Models).map(([key, value]) => [key, Object.keys(value.schema.paths)])

  res.status(200).send(Object.fromEntries(entries))
})

router.get('/:model', async (req, res, next) => {
  const { model } = req.params

  if (Models[model] == null) return res.status(404).send('Комплектующий не найден')

  const stock = await Models[model]?.find({})

  res.status(200).send(stock)
})
// router.get('/:model', async (req, res, next) => {
//   const modelName = req.params.model

//   if (Models[modelName] == null)
//     return res.status(404).send('Комплектующий не найден')

//   console.log(Models[modelName].schema)
//   const instances = await Models[modelName]?.findAll({
//     attributes: { exclude: ['createdAt', 'updatedAt'] }
//   }).catch(() => undefined)
//   if (instances == null)
//     return res.sendStatus(500)

//   res.send(instances)
// })

router.get('/:primaryKey', async (req, res, next) => {
  const modelName = req.params.model
  const primaryKey = (req.params.primaryKey !== 'null') ? req.params.primaryKey : null

  if (Models[modelName] == null)
    return res.sendStatus(404)

  try {
    var instance = await Models[modelName].findById(primaryKey, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
  } catch {
    return res.sendStatus(500)
  }
  if (instance == null)
    return res.sendStatus(400)

  res.send(instance)
})

router.get('/:value/:key', async (req, res, next) => {
  const { model } = req.params
  const value = (req.params.value !== 'null') ? req.params.value : null
  const key = req.params.key

  if (Models[model] == null)
    return res.sendStatus(404)

  let instances = await Models[model].findAll({
    where: Object.fromEntries([[key, value]]),
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }).catch(() => undefined)
  if (instances == null)
    return res.sendStatus(500)
  if (instances.length === 0)
    return res.sendStatus(400)

  res.send(instances)
})

router.post('/:model', async (req, res, next) => {
  const item = req.body
  delete item._id
  const { model } = req.params

  if (Models[model] == null)
    return res.sendStatus(404)

  const uniqueFields = Object.entries(Models[model].schema.tree)
    .map(([key, value]) => (value.unique != null) ? key : false)
    .filter((key) => !!key)
  if (uniqueFields.length > 0) {
    const entries = uniqueFields
      .map((key) => (item[key] != null) ? [key, item[key]] : false)
      .filter((kvp) => kvp)
    const options = Object.fromEntries(entries)

    const count = await Models[model].count({ where: options })
    if (count > 0)
      return res.sendStatus(400)
  }

  try {
    var id = await Models[model].create(item)
      .then(({ _id }) => _id)
      .catch((err) => console.warn(err))
  } catch {
    return res.sendStatus(500)
  }
  const instance = await Models[model].findById(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })

  res.status(201).send(instance)
})

router.put('/:primaryKey', async (req, res, next) => {
  const { model } = req.params
  const id = req.params.primaryKey
  const item = req.body
  delete item._id

  if (Models[model] == null)
    return res.sendStatus(404)

  try {
    var instance = await Models[model].findById(id)
  } catch {
    return res.sendStatus(500)
  }
  if (instance == null)
    return res.sendStatus(404)

  await instance.update(item)

  res.send(item)
})

router.delete('/:model/:primaryKey', async (req, res, next) => {
  const { model } = req.params
  const primaryKey = req.params.primaryKey

  if (Models[model] == null)
    return res.sendStatus(404)

  const instance = await Models[model].findById(primaryKey)
  if (instance == null)
    return res.sendStatus(404)

  const status = await instance.destroy()
    .then(() => 200)
    .catch(() => 400)

  res.sendStatus(status)
})

export default router