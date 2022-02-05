class ApiError extends Error {
  status
  errors

  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static BadRequest(message = 'Bad request', errors = []) {
    return new ApiError(400, message, errors)
  }

  static NotFound(message = 'Not Found') {
    return new ApiError(404, message)
  }
}

export default ApiError