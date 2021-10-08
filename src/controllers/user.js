const joi = require('joi')
const response = require('../helpers/response')
const { user } = require('../models')
const excel = require('exceljs')
const vs = require('fs-extra')
const { APP_URL } = process.env

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
        let sum = 0
        for (let i = 0; i < result.length; i++) {
          sum += parseInt(result[i].partice)
        }
        return response(res, 'success get user', { result, sum })
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
  },
  exportSqlUser: async (req, res) => {
    try {
      const result = await user.findAll()
      if (result) {
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet()
        const arr = []
        const header = ['Guest', 'Participation']
        const key = ['name', 'partice']
        for (let i = 0; i < header.length; i++) {
          let temp = { header: header[i], key: key[i] }
          arr.push(temp)
          temp = {}
        }
        worksheet.columns = arr
        const cek = worksheet.addRows(result)
        if (cek) {
          const name = new Date().getTime().toString().concat('-list_guest').concat('.xlsx')
          await workbook.xlsx.writeFile(name)
          vs.move(name, `assets/exports/${name}`, function (err) {
            if (err) {
              throw err
            }
            console.log('success')
          })
          return response(res, 'success', { link: `${APP_URL}/download/${name}` })
        } else {
          return response(res, 'failed create file', {}, 404, false)
        }
      } else {
        return response(res, 'failed', {}, 404, false)
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false)
    }
  }
}
