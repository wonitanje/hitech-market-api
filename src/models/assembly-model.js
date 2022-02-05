import { model, Schema } from 'mongoose'
import cpu from './components/cpu-model'
import gpu from './components/gpu-model'
import fan from './components/fan-model'
import ram from './components/ram-model'
import body from './components/body-model'
import storage from './components/storage-model'
import motherboard from './components/motherboard-model'
import powersupply from './components/powersupply-model'

const Assembly = new Schema({
  cpu: {
    type: cpu,
    required: true
  },
  gpu: {
    type: gpu
  },
  fan: {
    type: fan,
    required: true
  },
  ram: {
    type: ram,
    required: true
  },
  body: {
    type: body,
    required: true
  },
  storage: {
    type: storage,
    required: true
  },
  motherboard: {
    type: motherboard,
    required: true
  },
  powersupply: {
    type: powersupply,
    required: true
  }
})

export default model('Assembly', Assembly)