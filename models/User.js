const { DataTypes, Sequelize } = require('sequelize')
const db = require("../db/conn")

const User = db.define('User', {
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Digite o email'
            },
            isEmail: {
                args: [ true ],
                msg: `O email deve ser no formato "exemplo@email.com"`
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Digite a senha'
            },//porque ter limite de senha?
            min: {
                args: [ 6 ],
                msg: 'O mínimo é de 6 caracteres'
            },
            max: {
                args: [ 20 ],
                msg: 'O máximo é de 20 caracteres'
            }
        }
    }
},
)


module.exports = User