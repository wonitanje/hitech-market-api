module.exports = (sqlInstance) => {
  const User = require('../models/user')(sqlInstance)

  String = require('../utils/String')

  const Models = { User }

  class tableController {
    getModels(req, res) {
      const modelEntries = Object.entries(Models).map(([name, model]) => {
        delete model.rawAttributes.createdAt
        delete model.rawAttributes.updatedAt

        const attributesEntries = Object.entries(model.rawAttributes)
          .map(([attributeName, references]) => [attributeName, !references.allowNull])
        const attributesIsRequired = Object.fromEntries(attributesEntries)

        return [name, attributesIsRequired]
      })
      const models = Object.fromEntries(modelEntries)
      res.send(models)
    }

    async getAll(req, res) {
      const modelName = req.params.model.capitalize()

      if (Models[modelName] == null)
        return res.sendStatus(404)

      const instances = await Models[modelName].findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }).catch(() => undefined)
      if (instances == null) {
        console.warn('Instances is null')
        return res.sendStatus(500)
      }
      res.send(instances)
    }

    async getItem(req, res) {
      const modelName = req.params.model.capitalize()
      const primaryKey = (req.params.primaryKey !== 'null') ? req.params.primaryKey : null

      if (Models[modelName] == null)
        return res.sendStatus(404)

      try {
        var instance = await Models[modelName].findByPk(primaryKey, {
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
      } catch (e) {
        console.warn(e)
        return res.sendStatus(500)
      }
      if (instance == null)
        return res.sendStatus(400)

      res.send(instance)
    }

    async getItems(req, res) {
      const modelName = req.params.model.capitalize()
      const value = (req.params.value !== 'null') ? req.params.value : null
      const key = req.params.key

      if (Models[modelName] == null)
        return res.sendStatus(404)

      let instances = await Models[modelName].findAll({
        where: Object.fromEntries([[key, value]]),
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }).catch(() => undefined)
      if (instances == null)
        return res.sendStatus(500)
      if (instances.length === 0)
        return res.sendStatus(400)

      res.send(instances)
    }

    async addItem(req, res) {
      const item = req.body
      const modelName = req.params.model.capitalize()

      if (Models[modelName] == null)
        return res.sendStatus(404)

      const uniqueFields = Object.entries(Models[modelName].prototype.rawAttributes)
        .map(([key, value]) => (value.unique != null) ? key : false)
        .filter((key) => !!key)
      if (uniqueFields.length > 0) {
        const entries = uniqueFields
          .map((key) => (item[key] != null) ? [key, item[key]] : false)
          .filter((kvp) => kvp)
        const options = Object.fromEntries(entries)

        const count = await Models[modelName].count({ where: options })
        if (count > 0)
          return res.sendStatus(400)
      }

      try {
        var id = await Models[modelName].create(item)
          .then(({ id }) => id)
      } catch {
        return res.sendStatus(500)
      }
      const instance = await Models[modelName].findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
      res.status(201).send(instance)
    }

    async setItem(req, res) {
      const modelName = req.params.model.capitalize()
      const id = req.params.primaryKey
      const item = req.body
      const Model = Models[modelName]
      console.log(modelName, id, item)

      if (Model == null)
        return res.sendStatus(404)

      try {
        var instance = await Model.findByPk(id)
      } catch (e) {
        console.warn(e)
        return res.sendStatus(500)
      }
      if (instance == null)
        return res.sendStatus(404)

      const status = await instance.update(item)
        .then(() => 200)
        .catch(() => 400)

      res.sendStatus(status)
    }

    async popItem(req, res) {
      const modelName = req.params.model.capitalize()
      const primaryKey = req.params.primaryKey

      if (Models[modelName] == null)
        return res.sendStatus(404)

      const instance = await Models[modelName].findByPk(primaryKey)
      if (instance == null)
        return res.sendStatus(404)

      const status = await instance.destroy()
        .then(() => 200)
        .catch(() => 400)

      res.sendStatus(status)
    }
  }

  return new tableController()
}