'use strict'

const { Model, DataTypes } = require('sequelize')

module.exports = (sqlInstance) => {
  class User extends Model { }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize: sqlInstance,
    modelName: 'User',
  })

  return User
}