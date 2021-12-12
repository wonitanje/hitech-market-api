module.exports = (sqlInstance) => {
  const bcrypt = require('bcrypt')
  const User = require('../models/user')(sqlInstance)

  const salt = +process.env.SALT || 10

  class authController {
    async register(req, res) {
      const { username, password } = req.body

      if (!username instanceof String || !password instanceof String)
        return res.sendStatus(400)

      if (await User.count({ where: { username } }) > 0)
        return res.sendStatus(400)

      try {
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({
          username,
          password: hashedPassword
        })
        res.send(user)
      } catch {
        res.sendStatus(500)
      }
      console.log('register', username, res.statusCode)
    }

    async login(req, res) {
      const { username, password } = req.body

      if (!username instanceof String || !password instanceof String)
        return res.sendStatus(400)

      const user = await User.findOne({
        where: { username },
        attributes: ['password']
      })
      if (user == null)
        return res.sendStatus(400)

      try {
        const compared = await bcrypt.compare(password, user.password)
        if (!compared)
          return res.sendStatus(400)

        req.session.isAuth = true
        res.sendStatus(200)
      } catch (e) {
        console.warn(e)
        res.sendStatus(500)
      }
      console.log('login', username, res.statusCode)
    }

    logout(res, req) {
      req.session.destroy((e) => {
        if (e) console.warn(e)
      })
      res.sendStatus(200)
      console.log('logout', res.statusCode)
    }
  }

  return new authController()
}