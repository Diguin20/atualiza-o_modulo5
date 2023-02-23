const express = require('express')
const { userLogin } = require('../controllers/UserController')
//acho que essa const 'userLogin' não é necessaria
const router = express.Router()
const UserController = require('../controllers/UserController')

router.get( '/', UserController.getUserLogin)
router.post('/', UserController.postUserLogin)

router.get( '/register', UserController.getRegister)
router.post( '/register', UserController.postRegister)

module.exports = router