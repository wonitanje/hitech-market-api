import userService from '../services/user-service'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error.js'

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Ошибка при валидации', errors.array())
      }
      const { name, phone, email, password } = req.body
      const user = await userService.registration(name, phone, email, password)
      res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }).json(user)
      next(false)
    } catch (e) {
      return next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await userService.login(email, password)
      res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, domain: req.headers.origin, httpOnly: true, sameSite: 'none', secure: true }).json(user)
      next(false)
    } catch (e) {
      return next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken').json(token)
      next(false)
    } catch (e) {
      return next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      res.redirect(process.env.CLIENT_URL)
      next(false)
    } catch (e) {
      return next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const reqToken = req.cookies.refreshToken
      const { user, refreshToken, accessToken } = await userService.refresh(reqToken)
      res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }).json({ accessToken, user })
      next(false)
    } catch (e) {
      return next(e)
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req)
      res.json(user)
      next(false)
    } catch (e) {
      return next(e)
    }
  }
}

export default new UserController()