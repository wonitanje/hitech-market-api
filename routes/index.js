module.exports = (sqlInstanse) => {
  const authRoutes = require('./authRouter')(sqlInstanse)
  const tableRoutes = require('./tableRouter')(sqlInstanse)

  return {
    authRoutes,
    tableRoutes
  }
}