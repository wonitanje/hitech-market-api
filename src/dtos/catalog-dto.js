class UserDto {
  cpu
  gpu
  fan
  ram
  body
  storage
  motherboard
  powersupply

  constructor(model) {
    this.cpu = model.cpu
    this.gpu = model.gpu
    this.fan = model.fan
    this.ram = model.ram
    this.body = model.body
    this.storage = model.storage
    this.motherboard = model.motherboard
    this.powersupply = model.powersupply
  }
}

export default UserDto