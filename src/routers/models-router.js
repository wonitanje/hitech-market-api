import express from 'express'
import ApiError from '../exceptions/api-error'
import Components from '../models/components'

import Object from '../utils/Object'

const router = express.Router()
const Models = Components

router.get('/', async (req, res, next) => {
  const entries = Object.entriesArray(Models).map(([key, value]) => [key, Object.keys(value.schema.paths)])

  res.send(Object.fromEntries(entries))
  next(false)
})

router.get('/:model', async (req, res, next) => {
  const { model } = req.params

  if (Models[model] == null) return res.status(404).send('Комплектующий не найден')

  const stock = await Models[model]?.find({})

  res.send(stock)
  next(false)
})

router.get('/:primaryKey', async (req, res, next) => {
  const modelName = req.params.model
  const primaryKey = (req.params.primaryKey !== 'null') ? req.params.primaryKey : null

  if (Models[modelName] == null)
    return next(ApiError.NotFound())

  try {
    var instance = await Models[modelName].findById(primaryKey, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
  } catch (e) {
    return next(e)
  }
  if (instance == null) {
    return next(ApiError.BadRequest())
  }

  res.send(instance)
  next(false)
})

router.get('/:value/:key', async (req, res, next) => {
  const { model } = req.params
  const value = (req.params.value !== 'null') ? req.params.value : null
  const key = req.params.key

  if (Models[model] == null)
    return next(ApiError.NotFuond())

  let instances = await Models[model].findAll({
    where: Object.fromEntries([[key, value]]),
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  }).catch(() => undefined)

  if (instances == null || instances?.length === 0)
    return next(ApiError.BadRequest())

  res.send(instances)
  next(false)
})

router.post('/:model', async (req, res, next) => {
  const item = req.body
  delete item._id
  const { model } = req.params

  if (Models[model] == null)
    return next(ApiError.NotFound())

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
      return next(ApiError.NotFound())
  }

  try {
    var id = await Models[model].create(item)
      .then(({ _id }) => _id)
      .catch((err) => console.warn(err))
  } catch (e) {
    return next(e)
  }
  const instance = await Models[model].findById(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })

  res.status(201).send(instance)
  next(false)
})

router.put('/:primaryKey', async (req, res, next) => {
  const { model } = req.params
  const id = req.params.primaryKey
  const item = req.body
  delete item._id

  if (Models[model] == null)
    return next(ApiError.NotFound())

  try {
    var instance = await Models[model].findById(id)
  } catch (e) {
    return next(e)
  }
  if (instance == null)
    return next(ApiError.NotFound())

  await instance.update(item)

  res.send(item)
  next(false)
})

router.delete('/:model/:primaryKey', async (req, res, next) => {
  const { model } = req.params
  const primaryKey = req.params.primaryKey

  if (Models[model] == null)
    return next(ApiError.NotFound())

  const instance = await Models[model].findById(primaryKey)
  if (instance == null)
    return next(ApiError.NotFound())

  const status = await instance.destroy()
    .then(() => 200)
    .catch(() => null)

  if (!status) {
    return next(ApiError.BadRequest())
  }

  res.sendStatus(status)
  next(false)
})

export default router