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
})

router.get('/init', async (req, res, next) => {
  const data = {
    "cpu": {
      "name": "Процессор",
      "image": "cpu.png"
    },
    "body": {
      "name": "Корпус",
      "image": "body.png"
    },
    "ram": {
      "name": "Оперативная память",
      "image": "ram.png"
    },
    "gpu": {
      "name": "Графическая карта",
      "image": "gpu.png"
    },
    "motherboard": {
      "name": "Материнская плата",
      "image": "motherboard.png"
    },
    "powersupply": {
      "name": "Блок питания",
      "image": "powersupply.png"
    },
    "storage": {
      "name": "Хранилище данных",
      "image": "storage.png"
    },
    "fan": {
      "name": "Кулер",
      "image": "fan.png"
    }
  }

  const instance = new Catalog(data)
  await instance.save()

  if (instance == null)
    return res.sendStatus(400)

  res.send(instance)
})

export default router