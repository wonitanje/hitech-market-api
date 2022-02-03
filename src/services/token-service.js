import jwt from 'jsonwebtoken'
import Token from '../models/token-model'

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const token = await Token.findOne({ user: userId })
    if (token) {
      token.refreshToken = refreshToken;
      return await token.save()
    }

    return await (new Token({ user: userId, refreshToken })).save()
  }

  async removeToken(refreshToken) {
    return await Token.deleteOne({ refreshToken })
  }

  async findToken(refreshToken) {
    return await Token.findOne({ refreshToken })
  }
}

export default new TokenService()