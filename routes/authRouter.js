module.exports = (sqlInstance) => {
  const router = new require('express').Router()
  const controller = require('../controllers/authController')(sqlInstance)

  router.post('/api/register', controller.register)
  router.post('/api/login', controller.login)
  router.post('/api/logout', controller.logout)

  return router
}