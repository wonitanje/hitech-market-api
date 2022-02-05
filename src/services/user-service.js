const uuid = require('uuid')
import User from '../models/user-model'
import bcrypt from 'bcrypt'
// import mailService from './mail-service'
import tokenService from './token-service'
import UserDto from '../dtos/user-dto'
import ApiError from '../exceptions/api-error.js'

class UserService {
  salt = process.env.SALT

  async registration(name, phone, email, password) {
    const candidate = await User.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, salt)
    const activationLink = uuid.v4()

    const user = new User({ name, phone, email, password: hashPassword, activationLink })
    await user.save()
    // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { accessToken: tokens.accessToken, user: userDto }
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    const user = await User.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest('Неверный логин или пароль')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный логин или пароль')
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { accessToken: tokens.accessToken, user: userDto }
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await User.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ email: userDto.email })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { accessToken: tokens.accessToken, user: userDto }
  }

  async getUser(req) {
    const email = req.user.email
    const user = await User.findOne({ email })

    return new UserDto(user)
  }
}

export default new UserService()