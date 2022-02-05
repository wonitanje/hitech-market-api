import { model, Schema } from 'mongoose'
import cpu from './components/cpu-model'
import gpu from './components/gpu-model'
import fan from './components/fan-model'
import ram from './components/ram-model'
import body from './components/body-model'
import storage from './components/storage-model'
import motherboard from './components/motherboard-model'
import powersupply from './components/powersupply-model'

const Order = new Schema({
  customerPhone: {
    type: String,
    required: true
  },
  components: {
    type: [[ref('cpu')], [ref('gpu')]], //, fan, ram, body, storage, motherboard, powersupply],
    default: []
  },
  price: {
    type: Number,
    required: true
  }
});

export default model('Order', Order);