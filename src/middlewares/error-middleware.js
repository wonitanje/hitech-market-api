import ApiError from '../exceptions/api-error'

export default function (err, req, res, next) {
  if (!err) {
    return next()
  }

  if (err instanceof ApiError) {
    res.status(err?.status).json({ message: err?.message, errors: err?.errors })
  } else {
    res.status(500).json({ message: 'Непредвиденная ошибка' })
  }


  next()
}