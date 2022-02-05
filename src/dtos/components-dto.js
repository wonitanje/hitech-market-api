class UserDto {
  component

  constructor(modelName, model) {
    this.component = [...Object.entries(Components[modelName].schema.paths)].map(
      ([prop, options]) => {
        if (options.instance === 'Array') {
          return JSON.parse(model[prop])
        } else {
          return model.prop
        }
      }
    )
  }
}

export default UserDto