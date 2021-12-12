module.exports = (sqlInstance) => {
  const router = new require('express').Router()
  const controller = require('../controllers/tableController')(sqlInstance)

  router.get('/api/models', controller.getModels)
  router.get('/api/:model', controller.getAll)
  router.get('/api/:model/:primaryKey', controller.getItem)
  router.get('/api/:model/:value/:key', controller.getItems)
  router.put('/api/:model', controller.addItem)
  router.post('/api/:model/:primaryKey', controller.setItem)
  router.delete('/api/:model/:primaryKey', controller.popItem)

  return router
}