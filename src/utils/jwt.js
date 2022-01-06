module.exports = (req, res, next) => {
  const jwt = require('jsonwebtoken')
  const access = process.env.JWT_ACCESS || 'my-secret-key'
  const refresh = process.env.JWT_REFRESH || 'my-secret-key'

  function generateToken(body) {
    const accessToken = jwt.sign(body, access)
    return { accessToken }
  }

  next()
}