const joi = require('joi')
const response = require('../helpers/response')
const { user } = require('../models')

module.exports = {
  addUser: async (req, res) => {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().allow(''),
        phone: joi.string().allow(''),
        from: joi.string().allow(''),
        partice: joi.string().allow(''),
        doa: joi.string().allow('')
      })
      const { value: results, error } = schema.validate(req.body)
      if (error) {
        return response(res, 'Error', { error: error.message }, 401, false)
      } else {
        const result = await user.findAll({
          where: {
            name: results.name
          }
        })
        if (result.length > 0) {
          return response(res, `${result[0].name} telah terdaftar`, { result })
        } else {
          const result = await user.create(results)
          if (result) {
            return response(res, `Selamat Datang ${result[0].name}`, { result })
          } else {
            return response(res, 'tamu gagal dikonfirmasi', {}, 404, false)
          }
        }
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false)
    }
  },
  getUser: async (req, res) => {
    try {
      const result = await user.findAll({
        order: [['id', 'DESC']]
      })
      if (result) {
        return response(res, 'success get user', { result })
      } else {
        return response(res, 'failed get user', {}, 404, false)
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false)
    }
  },
  deleteUser: async (req, res) => {
    try {
      const result = await user.findAll()
      if (result.length > 0) {
        const cek = []
        for (let i = 0; i < result.length; i++) {
          const findUser = await user.findOne({
            where: {
              name: result[i].name
            }
          })
          if (findUser) {
            await findUser.destroy()
            cek.push(1)
          }
        }
        if (cek.length === result.length) {
          return response(res, 'success delete data user')
        } else {
          return response(res, 'data user is null')
        }
      } else {
        return response(res, 'data user is null')
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false)
    }
  }
}
