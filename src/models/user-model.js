const { Schema, model } = require('mongoose');

const User = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  activationLink: {
    type: String
  },
  role: {
    type: Number,
    default: 0
  }
})

export default model('User', User);