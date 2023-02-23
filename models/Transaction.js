const { DataTypes } = require('sequelize')
const db = require("../db/conn")
const User = require('./User')

const Transaction = db.define('Transaction', {
    transaction_type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: 'Escolha um tipo de transação'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Preencha todos os campos'
            },
            notEmpty: {
                msg: 'Preencha todos os campos'
            },
        }
    },
    amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Preencha todos os campos'
            },
            notEmpty: {
                msg: 'Preencha todos os campos'
            },
            isDecimal: {
                args: [true],
                msg: 'Digite somente números'
            }
        }
    },
})

Transaction.belongsTo(User)
User.hasMany(Transaction)

module.exports = Transaction