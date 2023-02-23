const { raw } = require('mysql2')
const { Op } = require('sequelize')
const db = require('../db/conn')
const Transaction = require('../models/Transaction')
const Validador = require('../public/js/validations')


module.exports = class TransactionController {
    static async getHome(req, res) {
        const [results] = await db.query('SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 1 UNION ALL SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 0', function (error, rows) {
            if (error) { console.log(error) }
            return rows
        })
        let incomes = results[0].balance
        let expenses = results[1].balance

        let incomesValue = () => {
            if (incomes === null) {
                let incomes = '0'
                return incomes
            } else {
                return incomes
            }
        }
        let expensesValue = () => {
            if (expenses === null) {
                let expenses = '0'
                return expenses
            } else {
                return expenses
            }
        }
        let balanceValue = () => {
            if (balance === 0) {
                let balance = '0'
                return balance
            } else {
                return balance
            }
        }

        let balance = incomes - expenses

        const historic = await Transaction.findAll({
            order: [['createdAt', 'DESC']],
            limit: 3,
            raw: true,
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))

        res.render('dashboard/home', { dataCards: { incomes: incomesValue(), expenses: expensesValue(), balance: balanceValue() }, historic: historic })
    }

    static async getIncomes(req, res) {
        const cardIncomes = await Transaction.findAll({
            attributes: [[db.fn('sum', db.col('amount')), 'incomes']],
            where: { transaction_type: 1 },
            order: [['createdAt', 'DESC']],
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))

        const historic = await Transaction.findAll({
            where: { transaction_type: 1 },
            raw: true
        })
            .then((data) => {
                return data, console.log(data)
            })
            .catch((error) => console.log(error))


        res.render('dashboard/incomes', { cardIncomes: cardIncomes[0].incomes, historic: historic })
    }
    static async getExpenses(req, res) {
        const cardExpenses = await Transaction.findAll({
            attributes: [[db.fn('sum', db.col('amount')), 'expenses']],
            where: { transaction_type: 0 },
            order: [['createdAt', 'DESC']],
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))

        const historic = await Transaction.findAll({
            where: { transaction_type: 0 },
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))


        res.render('dashboard/expenses', { cardExpenses: cardExpenses[0].expenses, historic: historic })
    }


    static getCreate(req, res) {
        res.render('dashboard/create')
    }
    static async postCreate(req, res) {

        let booleanType = () => {
            let type = req.body.transaction_type
            if (type === 'income') {
                return true
            } else if (type === 'expense') {
                return false
            }
        }

        const [income] = await db.query('SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 1', function (errors, rows) {
            if (errors) { console.log(errors) }
            else {
                return rows
            }
        })

        let value = () => {
            let amount = req.body.amount
            let newAmount = amount.replace(',', '.')


            let incomes = income[0].balance
            let balance = incomes - newAmount

            if (balance < 0 && booleanType() === false) {
                let message = 'Não tem saldo suficiente para fazer essa transação'
                res.render('dashboard/create', { message })
                return
            }
            return newAmount
        }

        //criação do linha da coluna transiction
        const data = {
            transaction_type: booleanType(),
            description: req.body.description,
            amount: value(),
        }

        let dataBuild = Transaction.build(data)
        let validateErrors = await dataBuild.validate()
            .catch((err) => {
                return err.errors
            })

        if (validateErrors.length > 0) {
            let message = validateErrors[0].message
            res.render('dashboard/create', { message })
            return

        } else {
            await Transaction.create(data)
                .then( res.redirect( '/transactions/dashboard' ) )
                .catch( ( error ) => error.errors )
        }
    }


    static async getDetails(req, res) {
        let searchQuery = ''

        if(req.query.search) {
            searchQuery = req.query.search
        }

        await Transaction.findAll( {
            where: {
                description: { [ Op.like ]: `%${searchQuery}%` }
            },
            order: [['createdAt', 'ASC']],
            raw: true
        })
        .then( (data) => {
            let transactionsQtd = data.length
            if(transactionsQtd === 0) {
                return false
            }

            res.render('dashboard/search', { searchQuery, transactionsQtd, data: data})
        })
                

        
    }


    static getEdit(req, res) {
        const id = req.params.id
        Transaction.findOne({ where: { id: id }, raw: true })
            .then((data) => {
                res.render('dashboard/edit', { data })
            })
            .catch((error) => console.log(error))

    }
    static async postEdit(req, res) {
        const id = req.params.id
        let booleanType = () => {
            let type = req.body.transaction_type
            if (type === 'income') {
                return true
            } else if (type === 'expense') {
                return false
            }
        }
        let value = () => {
            let amount = req.body.amount
            let newAmount = amount.replace(',', '.')
            console.log(newAmount)
            return newAmount
        }
        const data = {
            transaction_type: booleanType(),
            description: req.body.description,
            amount: value(),
        }

        await Transaction.update(data, { where: { id: id }, raw: true })
            .then(() => {
                res.redirect('/transactions/historic')
            })
            .catch((error) => console.log(error))
    }


    static getHistoric(req, res) {
        Transaction.findAll({
            raw: true,
            order: [['createdAt', 'DESC']],
        })
            .then((data) => {
                res.render('dashboard/transactions', { transaction: data })
            })
            .catch((error) => console.log(error))
    }

    static postDelete(req, res) {
        const id = req.params.id
        Transaction.destroy({ where: { id: id } })
            .then(res.redirect('/transactions/dashboard'))
            .catch((error) => console.log(error))
    }
}