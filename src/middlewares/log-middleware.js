export default function (req, res, next) {
  console.log('\n', res.statusCode, req.method, req.url, '|', req.headers.origin, '|', req.headers['user-agent'])
  next()
}