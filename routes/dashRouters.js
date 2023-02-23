const express = require('express')
const router = express.Router()
const TransactionController = require('../controllers/TransactionController')
const checkAuth = require('../helpers/auth').checkAuth;


router.get( '/dashboard', TransactionController.getHome)

router.get( '/incomes', TransactionController.getIncomes)
router.get( '/expenses', TransactionController.getExpenses)

router.get( '/create', TransactionController.getCreate)
router.post( '/create', TransactionController.postCreate)

router.get( '/search', TransactionController.getDetails )

router.get( '/edit/:id', TransactionController.getEdit)
router.post( '/edit/:id', TransactionController.postEdit)

router.post( '/delete/:id', TransactionController.postDelete)

router.get( '/historic', TransactionController.getHistoric)


module.exports = router