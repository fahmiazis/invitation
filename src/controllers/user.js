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
          return response(res, 'tamu telah terdaftar', { result })
        } else {
          const result = await user.create(results)
          if (result) {
            return response(res, 'tamu berhasil dikonfirmasi', { result })
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
      const result = await user.findAll()
      if (result) {
        return response(res, 'success get user', { result })
      } else {
        return response(res, 'failed get user', {}, 404, false)
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false)
    }
  }
}
