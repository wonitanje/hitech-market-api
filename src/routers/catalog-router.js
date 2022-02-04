import { Router } from 'express'
import Catalog from '../models/catalog-model'

const router = Router()

router.get('/', async (req, res, next) => {
  const catalog = await Catalog.findOne({
    attributes: { exclude: ['_id', '__v'] }
  }).select(['-_id', '-__v'])

  if (catalog == null)
    return res.sendStatus(404)

  res.send(catalog)
  next(false)
})

export default router