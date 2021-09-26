const route = require('express').Router()
const user = require('../controllers/user')

route.post('/add', user.addUser)
route.get('/get', user.getUser)
route.delete('/del', user.deleteUser)

module.exports = route
