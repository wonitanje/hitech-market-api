class UserDto {
  email
  phone
  name
  id
  isActivated
  role

  constructor(model) {
    this.email = model.email
    this.phone = model.phone
    this.name = model.name
    this.id = model._id
    this.isActivated = model.isActivated
    this.role = model.role
  }
}

export default UserDto